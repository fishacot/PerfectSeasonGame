#!/usr/bin/env node
/**
 * 82-0 mechanics parity gate.
 * Fixtures must match deterministic simulateSeason core (jitter=0).
 * Run: npm run validate:82-0-parity
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const { simulateBasketball } = await import(
  pathToFileURL(join(ROOT, "src/lib/simulation/adapters/basketball.ts")).href
);

const fixtures = JSON.parse(
  readFileSync(join(__dirname, "fixtures/82-0-lineups.json"), "utf8"),
);

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

let failures = 0;
let pending = 0;
const MIN_FIXTURES = 20;

for (const fx of fixtures) {
  const lineup = fx.lineup.map(toPlayer);
  const result = simulateBasketball(lineup, { jitter: 0, playstyle: "balanced" });

  if (fx.expectedWins == null) {
    pending++;
    console.log(
      `[PENDING] ${fx.id}: our=${result.wins}-${result.losses} (run calibrate-820-fixtures.mjs)`,
    );
    continue;
  }

  let fail = false;
  if (result.wins !== fx.expectedWins) {
    failures++;
    fail = true;
    console.error(
      `[FAIL] ${fx.id}: expected ${fx.expectedWins} wins, got ${result.wins}`,
    );
  }
  if (fx.expectedGrade && result.breakdown.grade !== fx.expectedGrade) {
    failures++;
    fail = true;
    console.error(
      `[FAIL] ${fx.id}: expected grade ${fx.expectedGrade}, got ${result.breakdown.grade}`,
    );
  }
  if (fx.expectedWeakest && result.breakdown.weakestCategory !== fx.expectedWeakest) {
    failures++;
    fail = true;
    console.error(
      `[FAIL] ${fx.id}: expected weakest ${fx.expectedWeakest}, got ${result.breakdown.weakestCategory}`,
    );
  }
  if (!fail) {
    console.log(
      `[PASS] ${fx.id}: ${result.wins}-${result.losses} grade=${result.breakdown.grade}`,
    );
  }
}

const calibrated = fixtures.length - pending;
console.log(
  `\nFixtures: ${fixtures.length}, calibrated: ${calibrated}, pending: ${pending}, failed: ${failures}`,
);

if (calibrated < MIN_FIXTURES) {
  console.error(`\nNeed at least ${MIN_FIXTURES} calibrated fixtures`);
  process.exit(1);
}

if (failures > 0) {
  console.error("\n82-0 parity NOT verified");
  process.exit(1);
}

if (pending > 0) {
  console.error("\nSome fixtures still pending calibration");
  process.exit(1);
}

console.log("\n82-0 parity verified.");
