#!/usr/bin/env node
/**
 * Full 82-0-style NBA database: BBR-verified pools + seed fallback.
 * Output: data/basketball/nba-database.json
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { basketballRating } from "./bbr-utils.mjs";

const require = createRequire(import.meta.url);
const { requiredPoolMin } = require("./bbr-utils.mjs");

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const POOLS_DIR = join(ROOT, "data", "raw", "basketball", "bbr-pools");
const NBA_JSON = join(ROOT, "data", "basketball", "nba.json");
const OUT = join(ROOT, "data", "basketball", "nba-database.json");

function playerKey(club, era, name) {
  return `${club}|${era}|${name.trim().toLowerCase()}`;
}

function loadBbrPools() {
  const byKey = new Map();
  if (!existsSync(POOLS_DIR)) return byKey;
  for (const file of readdirSync(POOLS_DIR).filter((f) => f.endsWith(".json"))) {
    const raw = JSON.parse(readFileSync(join(POOLS_DIR, file), "utf8"));
    if (!raw.players?.length) continue;
    const key = `${raw.club}|${raw.era}`;
    byKey.set(key, raw);
  }
  return byKey;
}

const bbrPools = loadBbrPools();
const seeds = existsSync(NBA_JSON) ? JSON.parse(readFileSync(NBA_JSON, "utf8")) : [];

const seedByKey = new Map();
for (const p of seeds) {
  const key = `${p.club}|${p.era}`;
  const bucket = seedByKey.get(key) ?? [];
  bucket.push(p);
  seedByKey.set(key, bucket);
}

const allKeys = new Set([...seedByKey.keys(), ...bbrPools.keys()]);
const players = [];
const seen = new Set();
const sources = { bbr: 0, seed: 0 };

for (const key of allKeys) {
  const [club, era] = key.split("|");
  const min = requiredPoolMin(club, era);
  const pool = bbrPools.get(key);
  const useBbr = pool?.players?.length && (min === 0 || pool.players.length >= min);
  const list = useBbr
    ? pool.players.map((p, i) => ({
        id: `nba-${club.replace(/\s/g, "-").toLowerCase()}-${era}-bbr-${i}`,
        name: p.name,
        club,
        era,
        positions: p.positions?.length ? p.positions : ["SF"],
        stats: p.stats,
        rating: p.rating ?? basketballRating(p.stats),
        season: p.season ?? null,
        source: "basketball-reference.com",
      }))
    : (seedByKey.get(key) ?? []).map((p) => ({ ...p, source: p.source ?? "seed" }));

  for (const p of list) {
    const k = playerKey(p.club, p.era, p.name);
    if (seen.has(k)) continue;
    seen.add(k);
    players.push(p);
    if (useBbr) sources.bbr++;
    else sources.seed++;
  }
}

const byEra = {};
const byClub = {};
for (const p of players) {
  byEra[p.era] = (byEra[p.era] ?? 0) + 1;
  byClub[p.club] = (byClub[p.club] ?? 0) + 1;
}

const meta = {
  description: "NBA player database (82-0 parity): franchise × decade pools",
  stats: ["ppg", "rpg", "apg", "spg", "bpg"],
  sourceNote: "BBR season averages where pool complete; seed fallback otherwise",
  generatedAt: new Date().toISOString(),
  players: players.length,
  bbrVerified: sources.bbr,
  seedFallback: sources.seed,
  bbrPoolsComplete: [...bbrPools.keys()].filter((k) => {
    const [club, era] = k.split("|");
    const min = requiredPoolMin(club, era);
    return min === 0 || (bbrPools.get(k)?.players?.length ?? 0) >= min;
  }).length,
  bbrPoolsTotal: bbrPools.size,
  clubs: Object.keys(byClub).length,
  eras: Object.keys(byEra).sort(),
  byEra,
};

mkdirSync(join(ROOT, "data", "basketball"), { recursive: true });
writeFileSync(OUT, JSON.stringify({ meta, players }, null, 2), "utf8");

console.log(`nba-database: ${players.length} players (${sources.bbr} BBR, ${sources.seed} seed)`);
console.log(`BBR pools: ${meta.bbrPoolsComplete}/${meta.bbrPoolsTotal} complete`);
console.log(`→ ${OUT}`);
