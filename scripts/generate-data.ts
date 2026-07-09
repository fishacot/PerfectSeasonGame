/**
 * Generates player datasets from curated seed rosters.
 * Run: npx tsx scripts/generate-data.ts
 */
import { writeFileSync, mkdirSync, readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { createRequire } from "module";
import type { Era, PlayerSeason } from "../src/lib/types";
import {
  BASKETBALL_ERAS,
  FOOTBALL_ERAS,
  FOOTBALL_ERAS_EXTENDED,
  HOCKEY_ERAS,
} from "../src/lib/config/eras";
import { NBA_POOL, NBA_TEAMS } from "./seeds/nba";
import { NBA_EXTRA_POOL } from "./seeds/nba-extra";
import { NBA_CORE_BOOST } from "./seeds/nba-core-boost";
import { NBA_ROSTER_DEPTH } from "./seeds/nba-roster-depth";
import { FOOTBALL_POOL, FOOTBALL_CLUBS } from "./seeds/football";
import { FOOTBALL_CORE_BOOST } from "./seeds/football-core-boost";
import { FOOTBALL_EPL_EXTRA } from "./seeds/football-epl-extra";
import { FOOTBALL_LEAGUES_EXTRA } from "./seeds/football-leagues-extra";
import { NHL_POOL, NHL_TEAMS } from "./seeds/hockey";
import { HOCKEY_CORE_BOOST } from "./seeds/hockey-core-boost";
import { HOCKEY_EXTRA } from "./seeds/hockey-extra";
import { HOCKEY_PART3 } from "./seeds/hockey-part3";
import type { Seed } from "./seeds/types";

const require = createRequire(import.meta.url);
const { requiredPoolMin } = require("./pipeline/bbr-utils.mjs") as {
  requiredPoolMin: (club: string, era: string) => number;
};

function mk(
  prefix: string,
  club: string,
  era: Era,
  seeds: Seed[],
): PlayerSeason[] {
  return seeds.map((s, i) => ({
    id: `${prefix}-${club.replace(/\s/g, "-").toLowerCase()}-${era}-${i}`,
    name: s.name,
    club,
    era,
    positions: s.positions,
    stats: s.stats,
    rating: s.rating,
  }));
}

function flattenPool(
  prefix: string,
  pool: Record<string, Partial<Record<Era, Seed[]>>>,
): PlayerSeason[] {
  const players: PlayerSeason[] = [];
  for (const [club, eras] of Object.entries(pool)) {
    for (const [era, seeds] of Object.entries(eras)) {
      if (!seeds?.length) continue;
      players.push(...mk(prefix, club, era as Era, seeds));
    }
  }
  return players;
}

function validatePool(
  players: PlayerSeason[],
  clubs: string[],
  eras: readonly Era[],
  min: number,
  label: string,
  onlyExisting = false,
): void {
  const gaps: string[] = [];
  for (const club of clubs) {
    for (const era of eras) {
      const n = players.filter((p) => p.club === club && p.era === era).length;
      if (onlyExisting && n === 0) continue;
      if (n < min) gaps.push(`${club}/${era}=${n}`);
    }
  }
  if (gaps.length > 0) {
    console.warn(`${label}: ${gaps.length} thin pools (<${min}):`, gaps.slice(0, 12).join(", "), gaps.length > 12 ? "…" : "");
  }
}

/** Strip diacritics so seed ASCII (Dragic) merges with BBR (Dragić). */
function normalizePlayerName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function playerKey(club: string, era: string, name: string): string {
  return `${club}|${era}|${normalizePlayerName(name)}`;
}

function mergeClubPools(
  ...pools: Record<string, Partial<Record<Era, Seed[]>>>[]
): Record<string, Partial<Record<Era, Seed[]>>> {
  const merged: Record<string, Partial<Record<Era, Seed[]>>> = {};
  const seen = new Set<string>();

  for (const pool of pools) {
    for (const [club, eras] of Object.entries(pool)) {
      merged[club] ??= {};
      for (const [era, seeds] of Object.entries(eras)) {
        if (!seeds?.length) continue;
        const bucket = merged[club]![era as Era] ?? [];
        for (const seed of seeds) {
          const key = playerKey(club, era, seed.name);
          if (seen.has(key)) continue;
          seen.add(key);
          bucket.push(seed);
        }
        merged[club]![era as Era] = bucket;
      }
    }
  }
  return merged;
}

function dedupePlayers(players: PlayerSeason[]): PlayerSeason[] {
  const seen = new Set<string>();
  const out: PlayerSeason[] = [];
  for (const p of players) {
    const key = playerKey(p.club, p.era, p.name);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

function assertNoDuplicates(players: PlayerSeason[], label: string): void {
  const counts = new Map<string, number>();
  for (const p of players) {
    const key = playerKey(p.club, p.era, p.name);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const dups = [...counts.entries()].filter(([, n]) => n > 1);
  if (dups.length > 0) {
    throw new Error(
      `${label}: ${dups.length} duplicate name+club+era entries, e.g. ${dups[0][0]}`,
    );
  }
}

function filterBoostAgainstBase(
  base: Record<string, Partial<Record<Era, Seed[]>>>,
  boost: Record<string, Partial<Record<Era, Seed[]>>>,
): Record<string, Partial<Record<Era, Seed[]>>> {
  const out: Record<string, Partial<Record<Era, Seed[]>>> = {};
  for (const [club, eras] of Object.entries(boost)) {
    for (const [era, seeds] of Object.entries(eras)) {
      if (!seeds?.length) continue;
      const baseNames = new Set(
        (base[club]?.[era as Era] ?? []).map((s) => normalizePlayerName(s.name)),
      );
      const filtered = seeds.filter((s) => !baseNames.has(normalizePlayerName(s.name)));
      if (filtered.length === 0) continue;
      out[club] ??= {};
      out[club][era as Era] = filtered;
    }
  }
  return out;
}

type BbrRef = {
  club: string;
  era: Era;
  name: string;
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  bpg: number;
};

type FbrefRef = {
  club: string;
  era: Era;
  name: string;
  goals: number;
  assists: number;
};

function loadBbrReference(): BbrRef[] {
  const dir = join(process.cwd(), "scripts", "bbr-reference");
  const entries: BbrRef[] = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const raw = JSON.parse(readFileSync(join(dir, file), "utf8")) as
      | BbrRef[]
      | { entries: BbrRef[] };
    if (Array.isArray(raw)) entries.push(...raw);
    else if (raw.entries) entries.push(...raw.entries);
  }
  return entries;
}

function loadFbrefReference(): FbrefRef[] {
  const dir = join(process.cwd(), "scripts", "fbref-reference");
  const entries: FbrefRef[] = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const raw = JSON.parse(readFileSync(join(dir, file), "utf8")) as FbrefRef[];
    entries.push(...raw);
  }
  return entries;
}

/** Canonical BBR stats override verified players in final output. */
function basketballRating(stats: Record<string, number>): number {
  const raw =
    50 +
    2.2 * (stats.ppg ?? 0) +
    0.9 * (stats.rpg ?? 0) +
    1.1 * (stats.apg ?? 0) +
    2 * (stats.spg ?? 0) +
    1.5 * (stats.bpg ?? 0);
  return Math.min(99, Math.max(50, Math.round(raw)));
}

type BbrPoolFile = {
  club: string;
  era: Era;
  players: {
    name: string;
    positions: string[];
    season?: string;
    stats: Record<string, number>;
    rating?: number;
  }[];
};

/** Canonical decade pools from Basketball-Reference (see fetch-bbr-decade-pools.mjs). */
function loadBbrDecadePools(): Map<string, PlayerSeason[]> {
  const dir = join(process.cwd(), "data", "raw", "basketball", "bbr-pools");
  const out = new Map<string, PlayerSeason[]>();
  if (!existsSync(dir)) return out;

  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const m = file.match(/^(.+)_(\d{4}s)\.json$/);
    if (!m) continue;
    const club = m[1]!.replace(/_/g, " ");
    const era = m[2] as Era;
    const raw = JSON.parse(readFileSync(join(dir, file), "utf8")) as BbrPoolFile;
    if (!raw.players?.length) continue;
    const key = `${raw.club ?? club}|${raw.era ?? era}`;
    const players: PlayerSeason[] = (raw.players ?? []).map((p, i) => ({
      id: `nba-${(raw.club ?? club).replace(/\s/g, "-").toLowerCase()}-${era}-bbr-${i}`,
      name: p.name,
      club: raw.club ?? club,
      era,
      positions: p.positions?.length ? p.positions : ["SF"],
      stats: p.stats,
      rating: p.rating ?? basketballRating(p.stats),
    }));
    out.set(key, players);
  }
  return out;
}

function unionPositions(...lists: string[][]): string[] {
  const order = ["PG", "SG", "G", "SF", "PF", "F", "C"];
  const set = new Set(lists.flat());
  return order.filter((p) => set.has(p));
}

function load820PositionIndex(): Map<string, string[]> {
  const path = join(process.cwd(), "data", "basketball", "nba-database.json");
  const out = new Map<string, string[]>();
  if (!existsSync(path)) return out;
  const raw = JSON.parse(readFileSync(path, "utf8")) as {
    players?: { club: string; era: string; name: string; positions: string[] }[];
  };
  for (const p of raw.players ?? []) {
    out.set(playerKey(p.club, p.era, p.name), p.positions ?? []);
  }
  return out;
}

function buildBasketballPlayers(
  seedPlayers: PlayerSeason[],
  bbrPools: Map<string, PlayerSeason[]>,
): PlayerSeason[] {
  if (bbrPools.size === 0) return seedPlayers;

  const pos820 = load820PositionIndex();
  const seedByKey = new Map<string, PlayerSeason[]>();
  const seedByName = new Map<string, PlayerSeason>();
  for (const p of seedPlayers) {
    const key = `${p.club}|${p.era}`;
    const bucket = seedByKey.get(key) ?? [];
    bucket.push(p);
    seedByKey.set(key, bucket);
    seedByName.set(playerKey(p.club, p.era, p.name), p);
  }

  const allKeys = new Set([...seedByKey.keys(), ...bbrPools.keys()]);
  const merged: PlayerSeason[] = [];
  for (const key of allKeys) {
    const bbr = bbrPools.get(key) ?? [];
    const seeds = seedByKey.get(key) ?? [];
    const byName = new Map<string, PlayerSeason>();

    for (const p of seeds) {
      byName.set(playerKey(p.club, p.era, p.name), p);
    }
    for (const p of bbr) {
      const seed = byName.get(playerKey(p.club, p.era, p.name));
      const from820 = pos820.get(playerKey(p.club, p.era, p.name));
      const positions = unionPositions(
        p.positions ?? [],
        seed?.positions ?? [],
        from820 ?? [],
      );
      byName.set(playerKey(p.club, p.era, p.name), {
        ...p,
        positions: positions.length ? positions : p.positions,
      });
    }
    merged.push(...byName.values());
  }
  return merged;
}

function validateBasketballPools(
  _players: PlayerSeason[],
  bbrPools: Map<string, PlayerSeason[]>,
): void {
  const gaps: string[] = [];
  for (const key of bbrPools.keys()) {
    const [club, era] = key.split("|") as [string, string];
    const min = requiredPoolMin(club, era);
    if (min === 0) continue;
    const n = bbrPools.get(key)?.length ?? 0;
    if (n > 0 && n < min) gaps.push(`${key}=${n} (need ${min}, using seeds)`);
  }
  if (gaps.length > 0) {
    console.warn(
      `basketball BBR partial pools: ${gaps.slice(0, 6).join(", ")}${gaps.length > 6 ? " …" : ""}`,
    );
  }
}

/** Legacy sample overrides — skip players already sourced from BBR decade pools. */
function applyBbrToPlayers(
  players: PlayerSeason[],
  reference: BbrRef[],
  bbrPoolKeys: Set<string>,
): number {
  let applied = 0;
  const index = new Map(
    players.map((p) => [playerKey(p.club, p.era, p.name), p] as const),
  );
  for (const ref of reference) {
    if (bbrPoolKeys.has(`${ref.club}|${ref.era}`)) continue;
    const p = index.get(playerKey(ref.club, ref.era, ref.name));
    if (!p) continue;
    p.stats = {
      ppg: ref.ppg,
      rpg: ref.rpg,
      apg: ref.apg,
      spg: ref.spg,
      bpg: ref.bpg,
    };
    applied++;
  }
  return applied;
}

function applyFbrefToPlayers(players: PlayerSeason[], reference: FbrefRef[]): number {
  let applied = 0;
  const index = new Map(
    players.map((p) => [playerKey(p.club, p.era, p.name), p] as const),
  );
  for (const ref of reference) {
    const p = index.get(playerKey(ref.club, ref.era, ref.name));
    if (!p) continue;
    p.stats = { ...p.stats, goals: ref.goals, assists: ref.assists };
    applied++;
  }
  return applied;
}

const NBA_BASE_MERGED = mergeClubPools(NBA_POOL, NBA_EXTRA_POOL);
const NBA_BOOST_FILTERED = filterBoostAgainstBase(NBA_BASE_MERGED, NBA_CORE_BOOST);
const NBA_MERGED = mergeClubPools(
  NBA_BASE_MERGED,
  NBA_BOOST_FILTERED,
  NBA_ROSTER_DEPTH,
);
const NBA_ALL_TEAMS = [...new Set([...NBA_TEAMS, ...Object.keys(NBA_EXTRA_POOL)])];

const outDir = join(process.cwd(), "data");
mkdirSync(join(outDir, "football"), { recursive: true });
mkdirSync(join(outDir, "basketball"), { recursive: true });
mkdirSync(join(outDir, "hockey"), { recursive: true });

const FOOTBALL_BASE = mergeClubPools(FOOTBALL_POOL, FOOTBALL_EPL_EXTRA);
const FOOTBALL_BOOST_FILTERED = filterBoostAgainstBase(
  FOOTBALL_BASE,
  FOOTBALL_CORE_BOOST,
);
const FOOTBALL_MERGED = mergeClubPools(
  FOOTBALL_BASE,
  FOOTBALL_BOOST_FILTERED,
  FOOTBALL_LEAGUES_EXTRA,
);
const FOOTBALL_ALL_CLUBS = [
  ...new Set([
    ...FOOTBALL_CLUBS,
    ...Object.keys(FOOTBALL_EPL_EXTRA),
    ...Object.keys(FOOTBALL_LEAGUES_EXTRA),
  ]),
];
const NHL_MERGED = mergeClubPools(NHL_POOL, HOCKEY_CORE_BOOST, HOCKEY_EXTRA, HOCKEY_PART3);
const NHL_ALL_TEAMS = [
  ...new Set([...NHL_TEAMS, ...Object.keys(HOCKEY_EXTRA), ...Object.keys(HOCKEY_PART3)]),
];

const football = dedupePlayers(flattenPool("fb", FOOTBALL_MERGED));
applyFbrefToPlayers(football, loadFbrefReference());
const bbrDecadePools = loadBbrDecadePools();
const basketballSeeds = dedupePlayers(flattenPool("nba", NBA_MERGED));
const basketball = dedupePlayers(
  buildBasketballPlayers(basketballSeeds, bbrDecadePools),
);
applyBbrToPlayers(basketball, loadBbrReference(), new Set(bbrDecadePools.keys()));
const hockey = dedupePlayers(flattenPool("nhl", NHL_MERGED));

assertNoDuplicates(basketball, "basketball");
assertNoDuplicates(football, "football");
assertNoDuplicates(hockey, "hockey");

validatePool(football, FOOTBALL_ALL_CLUBS, FOOTBALL_ERAS_EXTENDED, 6, "football", true);
validatePool(basketball, NBA_ALL_TEAMS, BASKETBALL_ERAS, 6, "basketball", true);
validatePool(hockey, NHL_ALL_TEAMS, HOCKEY_ERAS, 6, "hockey", true);
if (bbrDecadePools.size > 0) {
  validateBasketballPools(basketball, bbrDecadePools);
}

writeFileSync(join(outDir, "football", "all.json"), JSON.stringify(football, null, 2));
writeFileSync(join(outDir, "basketball", "nba.json"), JSON.stringify(basketball, null, 2));
writeFileSync(join(outDir, "hockey", "nhl.json"), JSON.stringify(hockey, null, 2));

console.log(`football: ${football.length} players (fbref verified: ${loadFbrefReference().length} sample)`);
console.log(
  `basketball: ${basketball.length} players (BBR decade pools: ${bbrDecadePools.size}, ref sample: ${loadBbrReference().length})`,
);
console.log(`hockey: ${hockey.length} players`);
console.log("data generated");
