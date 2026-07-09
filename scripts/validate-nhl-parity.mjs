#!/usr/bin/env node
/** NHL parity harness — deterministic sim smoke. */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const { simulateHockey } = await import(
  pathToFileURL(join(ROOT, "src/lib/simulation/adapters/hockey.ts")).href
);

const fixtures = JSON.parse(
  readFileSync(join(__dirname, "fixtures/nhl-lineups.json"), "utf8"),
);

function toPlayer(p, idx) {
  return {
    id: `nhl-fixture-${idx}`,
    name: p.name,
    club: p.club ?? "Fixture",
    era: p.era,
    positions: p.positions ?? ["C"],
    stats: p.stats,
    rating: p.rating ?? 88,
  };
}

let failures = 0;
for (const fx of fixtures) {
  const lineup = fx.lineup.map(toPlayer);
  const result = simulateHockey(lineup);
  if (fx.expectedWins != null && result.wins !== fx.expectedWins) {
    failures++;
    console.error(`[FAIL] ${fx.id}: expected ${fx.expectedWins}, got ${result.wins}`);
  } else {
    console.log(
      `[PASS] ${fx.id}: ${result.wins}-${result.losses}${fx.expectedWins == null ? " (uncalibrated)" : ""}`,
    );
  }
}

if (failures > 0) process.exit(1);
console.log("\nNHL parity verified.");
