#!/usr/bin/env node
/**
 * Validates data/basketball/nba.json against curated BBR reference + pool sizes.
 * Exit 1 if any stat differs by more than TOLERANCE or BBR pool below minimum.
 * Run: npm run validate:nba
 */
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { requiredPoolMin, POOL_MIN } from "./pipeline/bbr-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const TOLERANCE = 0.5;
const STAT_KEYS = ["ppg", "rpg", "apg", "spg", "bpg"];

function loadReference() {
  const dir = join(__dirname, "bbr-reference");
  const entries = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const raw = JSON.parse(readFileSync(join(dir, file), "utf8"));
    if (Array.isArray(raw)) entries.push(...raw);
    else if (raw.entries) entries.push(...raw.entries);
  }
  return entries;
}

function loadBbrPoolKeys() {
  const dir = join(ROOT, "data", "raw", "basketball", "bbr-pools");
  if (!existsSync(dir)) return new Map();
  const sizes = new Map();
  for (const file of readdirSync(dir)) {
    const m = file.match(/^(.+)_(\d{4}s)\.json$/);
    if (!m) continue;
    const club = m[1].replace(/_/g, " ");
    const era = m[2];
    const raw = JSON.parse(readFileSync(join(dir, file), "utf8"));
    sizes.set(`${club}|${era}`, raw.players?.length ?? 0);
  }
  return sizes;
}

function normalizePlayerName(name) {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function playerKey(club, era, name) {
  return `${club}|${era}|${normalizePlayerName(name)}`;
}

function main() {
  const nbaPath = join(ROOT, "data", "basketball", "nba.json");
  const players = JSON.parse(readFileSync(nbaPath, "utf8"));
  const index = new Map();
  const nameCounts = new Map();
  for (const p of players) {
    const key = playerKey(p.club, p.era, p.name);
    index.set(key, p);
    nameCounts.set(key, (nameCounts.get(key) ?? 0) + 1);
  }
  const nameDups = [...nameCounts.entries()].filter(([, n]) => n > 1);
  if (nameDups.length > 0) {
    console.error(
      `Normalized name duplicates: ${nameDups.length}, e.g. ${nameDups[0][0]}`,
    );
    process.exit(1);
  }

  const bbrPools = loadBbrPoolKeys();
  const poolGaps = [];
  for (const [key, n] of bbrPools) {
    const [club, era] = key.split("|");
    const min = requiredPoolMin(club, era);
    if (min === 0) continue;
    if (n < min) poolGaps.push(`${key}=${n} (need ${min})`);
  }

  const nbaPoolGaps = [];
  const byCombo = new Map();
  for (const p of players) {
    const key = `${p.club}|${p.era}`;
    byCombo.set(key, (byCombo.get(key) ?? 0) + 1);
  }
  for (const [key, n] of byCombo) {
    const [club, era] = key.split("|");
    const min = requiredPoolMin(club, era);
    if (min === 0 || n >= min) continue;
    nbaPoolGaps.push(`${key}=${n} (need ${min})`);
  }

  const reference = loadReference();
  if (reference.length < 30) {
    console.error(`Reference too small: ${reference.length} entries (need >= 30)`);
    process.exit(1);
  }

  const mismatches = [];
  const missing = [];

  for (const ref of reference) {
    const { club, era, name } = ref;
    const poolKey = `${club}|${era}`;
    if (bbrPools.has(poolKey)) continue;
    const p = index.get(playerKey(club, era, name));
    if (!p) {
      missing.push({ club, era, name, season: ref.season });
      continue;
    }
    for (const key of STAT_KEYS) {
      const expected = ref[key];
      const got = p.stats?.[key];
      if (expected == null || got == null) continue;
      if (Math.abs(got - expected) > TOLERANCE) {
        mismatches.push({
          club,
          era,
          name,
          stat: key,
          expected,
          got,
          season: ref.season,
        });
      }
    }
  }

  console.log(`NBA validate: ${reference.length} reference entries, ${players.length} players in nba.json`);
  if (bbrPools.size) {
    const sizes = [...bbrPools.values()];
    console.log(
      `BBR pools loaded: ${bbrPools.size}, min=${Math.min(...sizes)}, max=${Math.max(...sizes)}, target=${POOL_MIN}`,
    );
  }

  if (poolGaps.length) {
    console.error(`\nPool size gaps (${poolGaps.length}, need >= ${POOL_MIN} unless excepted):`);
    for (const g of poolGaps.slice(0, 20)) console.error(`  ${g}`);
    if (poolGaps.length > 20) console.error(`  … and ${poolGaps.length - 20} more`);
  }

  if (nbaPoolGaps.length) {
    console.error(`\nnba.json thin pools (${nbaPoolGaps.length}, need >= ${POOL_MIN} unless excepted):`);
    for (const g of nbaPoolGaps.slice(0, 20)) console.error(`  ${g}`);
    if (nbaPoolGaps.length > 20) console.error(`  … and ${nbaPoolGaps.length - 20} more`);
  }

  if (missing.length) {
    console.error(`\nMissing (${missing.length}):`);
    for (const m of missing.slice(0, 20)) {
      console.error(`  ${m.club}/${m.era} ${m.name} (${m.season ?? "?"})`);
    }
    if (missing.length > 20) console.error(`  … and ${missing.length - 20} more`);
  }

  if (mismatches.length) {
    console.error(`\nMismatches (${mismatches.length}, tolerance ±${TOLERANCE}):`);
    for (const m of mismatches.slice(0, 30)) {
      console.error(
        `  ${m.club}/${m.era} ${m.name} ${m.stat}: expected ${m.expected}, got ${m.got} (${m.season ?? "?"})`,
      );
    }
    if (mismatches.length > 30) console.error(`  … and ${mismatches.length - 30} more`);
  }

  if (missing.length || mismatches.length || poolGaps.length || nbaPoolGaps.length) {
    process.exit(1);
  }
  console.log("PASS — all reference stats match nba.json");
}

main();
