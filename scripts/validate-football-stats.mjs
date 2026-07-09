#!/usr/bin/env node
/**
 * Validates data/football/all.json against curated FBref reference (sample).
 * Run: npm run validate:football
 */
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const TOLERANCE = 1;

function loadReference() {
  const dir = join(__dirname, "fbref-reference");
  const entries = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    entries.push(...JSON.parse(readFileSync(join(dir, file), "utf8")));
  }
  return entries;
}

function playerKey(club, era, name) {
  return `${club}|${era}|${name.trim().toLowerCase()}`;
}

function main() {
  const fbPath = join(ROOT, "data", "football", "all.json");
  const players = JSON.parse(readFileSync(fbPath, "utf8"));
  const index = new Map();
  for (const p of players) {
    index.set(playerKey(p.club, p.era, p.name), p);
  }

  const reference = loadReference();
  const mismatches = [];
  const missing = [];

  for (const ref of reference) {
    const p = index.get(playerKey(ref.club, ref.era, ref.name));
    if (!p) {
      missing.push(ref);
      continue;
    }
    for (const key of ["goals", "assists"]) {
      const expected = ref[key];
      const got = p.stats?.[key];
      if (expected == null || got == null) continue;
      if (Math.abs(got - expected) > TOLERANCE) {
        mismatches.push({ ...ref, stat: key, expected, got });
      }
    }
  }

  console.log(`Football validate: ${reference.length} reference, ${players.length} players`);

  if (missing.length) {
    console.error(`Missing (${missing.length}):`, missing.slice(0, 5).map((m) => m.name).join(", "));
  }
  if (mismatches.length) {
    console.error(`Mismatches (${mismatches.length}):`);
    for (const m of mismatches.slice(0, 15)) {
      console.error(`  ${m.club}/${m.era} ${m.name} ${m.stat}: expected ${m.expected}, got ${m.got}`);
    }
  }

  if (missing.length || mismatches.length) process.exit(1);
  console.log("PASS — football reference stats match");
}

main();
