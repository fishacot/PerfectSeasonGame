#!/usr/bin/env node
/**
 * Build decade pools from cached BBR HTML only (no network).
 * Fills gaps when live fetch was rate-limited but seasons are cached.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  allFranchises,
  clubSeasonsInEra,
  parsePerGameTable,
  mergeDecadePlayers,
  bbrYearToSeasonStart,
  basketballRating,
  requiredPoolMin,
} from "./bbr-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const OUT_DIR = join(ROOT, "data", "raw", "basketball", "bbr-pools");
const CACHE_DIR = join(ROOT, "data", "raw", "basketball", "bbr-seasons");
const ERAS = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];

function seasonLabel(bbrYear) {
  const start = bbrYearToSeasonStart(bbrYear);
  return `${start}-${String(start + 1).slice(-2)}`;
}

function poolPath(club, era) {
  return join(OUT_DIR, `${club}_${era}.json`.replace(/[\\/:*?"<>|]/g, "_"));
}

function buildFromCache(club, era) {
  const seasons = clubSeasonsInEra(club, era);
  const seasonRows = [];
  for (const { bbrYear, abbr } of seasons) {
    const cachePath = join(CACHE_DIR, `${abbr}_${bbrYear}.html`);
    if (!existsSync(cachePath)) continue;
    const parsed = parsePerGameTable(readFileSync(cachePath, "utf8"));
    if (!parsed.length) continue;
    seasonRows.push({ season: seasonLabel(bbrYear), abbr, players: parsed });
  }
  if (!seasonRows.length) return null;
  const merged = mergeDecadePlayers(seasonRows);
  return {
    club,
    era,
    fetchedAt: new Date().toISOString(),
    source: "basketball-reference.com",
    fromCache: true,
    seasons: seasonRows.map((s) => ({ season: s.season, abbr: s.abbr, count: s.players.length })),
    players: merged.map((p) => ({
      name: p.name,
      positions: p.positions,
      season: p.season,
      stats: p.stats,
      rating: basketballRating(p.stats),
    })),
  };
}

mkdirSync(OUT_DIR, { recursive: true });
let written = 0;
let skipped = 0;

for (const club of allFranchises()) {
  for (const era of ERAS) {
    const min = requiredPoolMin(club, era);
    if (min === 0) continue;
    const existing = existsSync(poolPath(club, era))
      ? JSON.parse(readFileSync(poolPath(club, era), "utf8"))
      : null;
    if (existing?.players?.length >= min) {
      skipped++;
      continue;
    }
    const pool = buildFromCache(club, era);
    if (!pool?.players?.length) continue;
    if (pool.players.length >= min || pool.players.length > (existing?.players?.length ?? 0)) {
      writeFileSync(poolPath(club, era), JSON.stringify(pool, null, 2), "utf8");
      written++;
      console.log(`${club}/${era}: ${pool.players.length} players${pool.players.length >= min ? "" : ` (need ${min})`}`);
    }
  }
}

const total = readdirSync(OUT_DIR).filter((f) => f.endsWith(".json")).length;
console.log(`\ncache build: wrote ${written}, skipped ok ${skipped}, total pools ${total}`);
