#!/usr/bin/env node
/**
 * Calibrate fixture expectedWins/grade/weakest from 82-0 engine (deterministic).
 * Run: node scripts/calibrate-820-fixtures.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const FIXTURES = join(__dirname, "fixtures/82-0-lineups.json");

const { simulateBasketball } = await import(
  pathToFileURL(join(ROOT, "src/lib/simulation/adapters/basketball.ts")).href
);

const fixtures = JSON.parse(readFileSync(FIXTURES, "utf8"));

function toPlayer(p, idx) {
  return {
    id: `fixture-${idx}`,
    name: p.name,
    club: "Fixture",
    era: p.era,
    positions: p.positions ?? ["SF"],
    stats: p.stats,
    rating: 90,
  };
}

for (const fx of fixtures) {
  const lineup = fx.lineup.map(toPlayer);
  const result = simulateBasketball(lineup);
  fx.expectedWins = result.wins;
  fx.expectedGrade = result.breakdown.grade;
  fx.expectedWeakest = result.breakdown.weakestCategory;
  fx.expectedCategories = result.breakdown.categories;
  console.log(
    `${fx.id}: ${result.wins}-${result.losses} grade=${result.breakdown.grade} weak=${result.breakdown.weakestCategory}`,
  );
}

writeFileSync(FIXTURES, JSON.stringify(fixtures, null, 2) + "\n", "utf8");
console.log(`Updated ${FIXTURES}`);
