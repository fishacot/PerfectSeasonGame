#!/usr/bin/env node
/**
 * Load NBA player stats exclusively from 82-0-challenge.com webpack bundle.
 * Source: module 7977 in chunk containing `let m=[...]` player arrays.
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { basketballRating } from "./bbr-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const BASE = "https://www.82-0-challenge.com";
const CHUNK_CACHE_DIR = join(__dirname, "..", ".820-chunks");
const NBA_JSON = join(ROOT, "data", "basketball", "nba.json");
const NBA_DB_JSON = join(ROOT, "data", "basketball", "nba-database.json");
const COMPLETE_JSON = join(ROOT, "data", "raw", "basketball", "DOWNLOAD_COMPLETE.json");

/** 82-0 team abbr → game club name (modern franchise labels). */
const ABBR_TO_CLUB = {
  ATL: "Hawks",
  BOS: "Celtics",
  BRK: "Nets",
  CHA: "Hornets",
  CHI: "Bulls",
  CHO: "Hornets",
  CLE: "Cavaliers",
  DAL: "Mavericks",
  DEN: "Nuggets",
  DET: "Pistons",
  GSW: "Warriors",
  HOU: "Rockets",
  IND: "Pacers",
  LAC: "Clippers",
  LAL: "Lakers",
  MEM: "Grizzlies",
  MIA: "Heat",
  MIL: "Bucks",
  MIN: "Timberwolves",
  NOP: "Pelicans",
  NYK: "Knicks",
  OKC: "Thunder",
  ORL: "Magic",
  PHI: "76ers",
  PHO: "Suns",
  PHX: "Suns",
  POR: "Trail Blazers",
  SAC: "Kings",
  SAS: "Spurs",
  TOR: "Raptors",
  UTA: "Jazz",
  WAS: "Wizards",
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchText(url, retries = 5) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "perfect-season-hub/820-fetch" },
        signal: AbortSignal.timeout(60_000),
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
  const html = await fetchText(`${BASE}/en/team-builder`);
  const chunks = [
    ...new Set(
      [...html.matchAll(/\/_next\/static\/chunks\/([^"']+\.js)/g)].map(
        (m) => m[1],
      ),
    ),
  ];
  for (const file of chunks) {
    const js = await fetchText(`${BASE}/_next/static/chunks/${file}`);
    if (js.includes("7977:function") && js.includes("let m=[")) {
      return { file, js };
    }
  }
  throw new Error("chunk with module 7977 not found in team-builder bundles");
}

function extract820Players(chunkJs) {
  const start = chunkJs.indexOf("7977:function");
  if (start < 0) throw new Error("7977:function missing");
  const end = chunkJs.indexOf("4496:function", start);
  if (end < 0) throw new Error("4496:function missing");
  const mod = chunkJs.slice(start, end);

  const raw = [];
  let pos = 0;
  while (true) {
    const i = mod.indexOf("JSON.parse('", pos);
    if (i < 0) break;
    const close = mod.indexOf("')", i + 12);
    if (close < 0) break;
    const data = (0, eval)(mod.slice(i, close + 2));
    if (Array.isArray(data) && data[0]?.pts !== undefined) raw.push(...data);
    pos = close + 2;
  }
  if (!raw.length) throw new Error("no player arrays extracted from 7977");
  return raw;
}

function mapPositions(positions) {
  if (!positions?.length) return ["SF"];
  const out = new Set();
  for (const p of positions) {
    const u = String(p).toUpperCase();
    if (u === "G") {
      out.add("PG");
      out.add("SG");
    } else if (u === "F") {
      out.add("SF");
      out.add("PF");
    } else if (["PG", "SG", "SF", "PF", "C"].includes(u)) {
      out.add(u);
    } else {
      out.add("SF");
    }
  }
  return [...out];
}

function toPlayerSeason(p) {
  const club = ABBR_TO_CLUB[p.team];
  if (!club) throw new Error(`unknown 82-0 team abbr: ${p.team}`);
  const stats = {
    ppg: p.pts,
    rpg: p.reb,
    apg: p.ast,
    spg: p.stl,
    bpg: p.blk,
  };
  return {
    id: p.id,
    name: p.name,
    club,
    era: p.decade,
    positions: mapPositions(p.positions),
    stats,
    rating: basketballRating(stats),
    source: "82-0-challenge.com",
  };
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

  let chunkFile = "";
  let chunkJs;

  if (fromFile) {
    chunkJs = readFileSync(fromFile, "utf8");
    chunkFile = fromFile;
    console.log("using local chunk:", fromFile);
  } else {
    const cachePath = join(CHUNK_CACHE_DIR, "9696-6c54a9d9869e047c.js");
    try {
      console.log("fetching team-builder chunks from", BASE);
      const found = await findPlayersChunk();
      chunkFile = found.file;
      chunkJs = found.js;
      mkdirSync(CHUNK_CACHE_DIR, { recursive: true });
      writeFileSync(join(CHUNK_CACHE_DIR, found.file), chunkJs, "utf8");
      console.log("cached chunk:", found.file, `(${chunkJs.length} bytes)`);
    } catch (e) {
      if (existsSync(cachePath) && readFileSync(cachePath, "utf8").includes("7977:function")) {
        console.warn("fetch failed, using cache:", cachePath, String(e));
        chunkJs = readFileSync(cachePath, "utf8");
        chunkFile = "9696-6c54a9d9869e047c.js";
      } else {
        throw e;
      }
    }
  }

  const raw = extract820Players(chunkJs);
  const players = raw.map(toPlayerSeason);
  assertNoDuplicates(players);

  if (!process.argv.includes("--force") && existsSync(NBA_JSON)) {
    const existing = JSON.parse(readFileSync(NBA_JSON, "utf8"));
    const bbrMerged =
      Array.isArray(existing) &&
      (existing.length > 1000 ||
        existing.some(
          (p) =>
            p.id?.includes("-bbr-") ||
            p.source?.includes("basketball-reference"),
        ));
    if (bbrMerged) {
      console.error(
        "Refusing to overwrite nba.json: BBR-merged database detected.",
      );
      console.error("Use npm run generate:data instead, or pass --force.");
      process.exit(1);
    }
  }

  const stats = poolStats(players);
  const generatedAt = new Date().toISOString();

  mkdirSync(dirname(NBA_JSON), { recursive: true });
  mkdirSync(dirname(COMPLETE_JSON), { recursive: true });

  writeFileSync(NBA_JSON, JSON.stringify(players, null, 2), "utf8");

  const db = {
    meta: {
      description: "NBA player database from 82-0-challenge.com",
      stats: ["ppg", "rpg", "apg", "spg", "bpg"],
      sourceNote: "Extracted from 82-0 webpack module 7977 (pts/reb/ast/stl/blk)",
      sourceUrl: `${BASE}/_next/static/chunks/${chunkFile}`,
      generatedAt,
      players: players.length,
      pools: stats.pools,
      clubs: stats.clubs,
      eras: Object.keys(stats.byEra).sort(),
      byEra: stats.byEra,
      byClub: stats.byClub,
      poolSizeMin: stats.minPool,
      poolSizeMax: stats.maxPool,
    },
    players,
  };
  writeFileSync(NBA_DB_JSON, JSON.stringify(db, null, 2), "utf8");

  const summary = {
    completedAt: generatedAt,
    source: "82-0-challenge.com",
    chunk: chunkFile,
    players: players.length,
    pools: stats.pools,
    clubs: stats.clubs,
    poolSize: `${stats.minPool}-${stats.maxPool}`,
  };
  writeFileSync(COMPLETE_JSON, JSON.stringify(summary, null, 2), "utf8");

  console.log("\n=== 82-0 PLAYER DATA LOADED ===");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
