#!/usr/bin/env node
/**
 * Load football player data from 38-0.org webpack bundle (UCL club × decade model).
 * Source chunk: module 80841 — l("id","Name","Club","2000s",[...],"ST",{attack,...})
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  CLUB_TO_GAME,
  GAME_CLUBS,
  compute380Overall,
  derive380DisplayStats,
  extract380OrgPlayers,
  map380Positions,
} from "./380-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const BASE = "https://www.38-0.org";
const CHUNK_CACHE_DIR = join(__dirname, "..", ".380-chunks");
const PLAYERS_CHUNK = "03b78z-83yf1m.js";
const FOOTBALL_JSON = join(ROOT, "data", "football", "all.json");
const FOOTBALL_DB_JSON = join(ROOT, "data", "football", "football-database.json");
const COMPLETE_JSON = join(ROOT, "data", "raw", "football", "DOWNLOAD_COMPLETE.json");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchText(url, retries = 5) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "perfect-season-hub/380-fetch" },
        signal: AbortSignal.timeout(90_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      lastErr = e;
      if (i < retries - 1) await sleep(2000 * (i + 1));
    }
  }
  throw lastErr;
}

async function findPlayersChunk() {
  const html = await fetchText(`${BASE}/draft`);
  const chunks = [
    ...new Set(
      [...html.matchAll(/\/_next\/static\/chunks\/([^"']+\.js)/g)].map(
        (m) => m[1],
      ),
    ),
  ];
  for (const file of chunks) {
    const js = await fetchText(`${BASE}/_next/static/chunks/${file}`);
    if (js.includes('l("') && js.includes("computeOverall") && js.includes("PLAYERS")) {
      return { file, js };
    }
  }
  throw new Error("38-0.org players chunk not found in /draft bundles");
}

function toPlayerSeason(raw) {
  const club = CLUB_TO_GAME[raw.club];
  if (!club || !GAME_CLUBS.has(club)) return null;
  const rating = compute380Overall(raw.primary, raw.area);
  const stats = derive380DisplayStats(raw.primary, raw.area);
  return {
    id: raw.id,
    name: raw.name,
    club,
    era: raw.decade,
    positions: map380Positions(raw.positions, raw.primary),
    stats,
    rating,
    source: "38-0.org",
    areaStats: raw.area,
    primaryPosition: raw.primary,
  };
}

function dedupeByNameClubEra(mapped) {
  const best = new Map();
  for (const p of mapped) {
    const key = `${p.club}|${p.era}|${p.name.trim().toLowerCase()}`;
    const prev = best.get(key);
    if (!prev || p.rating > prev.rating) best.set(key, p);
  }
  return [...best.values()];
}

function assertNoDuplicates(players) {
  const counts = new Map();
  for (const p of players) {
    const key = `${p.club}|${p.era}|${p.name.trim().toLowerCase()}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const dups = [...counts.entries()].filter(([, n]) => n > 1);
  if (dups.length) {
    throw new Error(
      `duplicate name+club+era: ${dups[0][0]} (+${dups.length - 1} more)`,
    );
  }
}

function poolStats(players) {
  const pools = new Map();
  const byEra = {};
  const byClub = {};
  for (const p of players) {
    const k = `${p.club}|${p.era}`;
    pools.set(k, (pools.get(k) ?? 0) + 1);
    byEra[p.era] = (byEra[p.era] ?? 0) + 1;
    byClub[p.club] = (byClub[p.club] ?? 0) + 1;
  }
  const sizes = [...pools.values()];
  return {
    pools: pools.size,
    minPool: Math.min(...sizes),
    maxPool: Math.max(...sizes),
    clubs: Object.keys(byClub).length,
    byEra,
    byClub,
  };
}

async function main() {
  const fromArg = process.argv.find((a) => a.startsWith("--from-file="));
  const fromFile =
    fromArg?.slice("--from-file=".length) ??
    (process.argv[2] && !process.argv[2].startsWith("-")
      ? process.argv[2]
      : null);

  let chunkFile = PLAYERS_CHUNK;
  let chunkJs;
  let sourceChunkName = PLAYERS_CHUNK;

  if (fromFile) {
    chunkJs = readFileSync(fromFile, "utf8");
    chunkFile = fromFile;
    sourceChunkName = fromFile.split(/[/\\]/).pop() ?? PLAYERS_CHUNK;
    console.log("using local chunk:", fromFile);
  } else {
    const cachePath = join(CHUNK_CACHE_DIR, PLAYERS_CHUNK);
    try {
      console.log("fetching 38-0.org /draft chunks from", BASE);
      const found = await findPlayersChunk();
      chunkFile = found.file;
      chunkJs = found.js;
      mkdirSync(CHUNK_CACHE_DIR, { recursive: true });
      writeFileSync(join(CHUNK_CACHE_DIR, found.file), chunkJs, "utf8");
      console.log("cached chunk:", found.file, `(${chunkJs.length} bytes)`);
    } catch (e) {
      if (existsSync(cachePath) && readFileSync(cachePath, "utf8").includes('l("')) {
        console.warn("fetch failed, using cache:", cachePath, String(e));
        chunkJs = readFileSync(cachePath, "utf8");
        chunkFile = PLAYERS_CHUNK;
      } else {
        throw e;
      }
    }
  }

  const raw = extract380OrgPlayers(chunkJs);
  const skippedClubs = new Set();
  for (const r of raw) {
    if (!CLUB_TO_GAME[r.club]) skippedClubs.add(r.club);
  }
  const mapped = dedupeByNameClubEra(raw.map(toPlayerSeason).filter(Boolean));
  assertNoDuplicates(mapped);

  if (!process.argv.includes("--force") && existsSync(FOOTBALL_JSON)) {
    const existing = JSON.parse(readFileSync(FOOTBALL_JSON, "utf8"));
    const seedGenerated =
      Array.isArray(existing) &&
      existing.length > 500 &&
      existing.some((p) => p.id?.startsWith("fb-"));
    if (seedGenerated && !process.argv.includes("--merge")) {
      console.error(
        "Refusing to overwrite all.json: seed-generated football DB detected.",
      );
      console.error("Pass --force to replace, or --merge to append 38-0 players.");
      process.exit(1);
    }
  }

  const stats = poolStats(mapped);
  const generatedAt = new Date().toISOString();

  mkdirSync(dirname(FOOTBALL_JSON), { recursive: true });
  mkdirSync(dirname(COMPLETE_JSON), { recursive: true });

  const exportPlayers = mapped.map(({ areaStats, primaryPosition, source, ...p }) => p);
  writeFileSync(FOOTBALL_JSON, JSON.stringify(exportPlayers, null, 2), "utf8");

  const db = {
    meta: {
      description: "Football player database from 38-0.org",
      model: "UCL club × decade (2000s–2020s)",
      stats: ["goals", "assists", "cleanSheets"],
      sourceNote:
        "Players + OVR from 38-0.org module 80841; G/A/CS derived from area ratings (38-0.org has no season totals)",
      sourceUrl: `${BASE}/_next/static/chunks/${sourceChunkName}`,
      generatedAt,
      players: mapped.length,
      rawExtracted: raw.length,
      skippedClubs: [...skippedClubs].sort(),
      pools: stats.pools,
      clubs: stats.clubs,
      eras: Object.keys(stats.byEra).sort(),
      byEra: stats.byEra,
      byClub: stats.byClub,
      poolSizeMin: stats.minPool,
      poolSizeMax: stats.maxPool,
    },
    players: mapped,
  };
  writeFileSync(FOOTBALL_DB_JSON, JSON.stringify(db, null, 2), "utf8");

  const summary = {
    completedAt: generatedAt,
    source: "38-0.org",
    chunk: sourceChunkName,
    players: mapped.length,
    rawExtracted: raw.length,
    skippedClubs: [...skippedClubs].sort(),
    pools: stats.pools,
    clubs: stats.clubs,
    poolSize: `${stats.minPool}-${stats.maxPool}`,
    eras: Object.keys(stats.byEra).sort(),
  };
  writeFileSync(COMPLETE_JSON, JSON.stringify(summary, null, 2), "utf8");

  console.log("\n=== 38-0 PLAYER DATA LOADED ===");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
