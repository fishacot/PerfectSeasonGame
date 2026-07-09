/**
 * Self-check for sandbox match engines.
 * Run: npx tsx scripts/check-sandbox-match.mjs
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const { simulateBasketballMatch } = await import(
  "../src/lib/simulation/match/basketball-match.ts"
);
const { simulateFootballMatch } = await import(
  "../src/lib/simulation/match/football-match.ts"
);

const nba = JSON.parse(
  readFileSync(join(root, "data/basketball/nba.json"), "utf8"),
);
const fb = JSON.parse(
  readFileSync(join(root, "data/football/all.json"), "utf8"),
);

function pick(players, n, pred) {
  const pool = pred ? players.filter(pred) : players.slice();
  pool.sort((a, b) => (b.stats.ppg ?? b.stats.goals ?? 0) - (a.stats.ppg ?? a.stats.goals ?? 0));
  const out = [];
  for (const p of pool) {
    out.push(p);
    if (out.length >= n) break;
  }
  if (out.length < n) throw new Error(`Need ${n} players, got ${out.length}`);
  return out;
}

const homeBb = pick(nba, 5);
const awayBb = pick(
  nba.filter((p) => !homeBb.some((h) => h.id === p.id)),
  5,
);

const bb1 = simulateBasketballMatch(homeBb, awayBb, { seed: 42 });
const bb2 = simulateBasketballMatch(homeBb, awayBb, { seed: 42 });
if (JSON.stringify(bb1) !== JSON.stringify(bb2)) {
  throw new Error("Basketball match not deterministic for same seed");
}
if (bb1.home.score < 85 || bb1.away.score < 85) {
  throw new Error(`Unrealistic BB scores ${bb1.home.score}-${bb1.away.score}`);
}
if (bb1.home.score > 160 || bb1.away.score > 160) {
  throw new Error(`Inflated BB scores ${bb1.home.score}-${bb1.away.score}`);
}
const bbPts = bb1.home.players.reduce((a, p) => a + p.pts, 0);
if (bbPts !== bb1.home.score) {
  throw new Error(`BB home pts sum ${bbPts} != score ${bb1.home.score}`);
}

const homeMin = bb1.home.players.map((p) => p.minutes);
const minSum = homeMin.reduce((a, b) => a + b, 0);
if (Math.abs(minSum - 240) > 0.2) {
  throw new Error(`BB home minutes sum ${minSum} != 240`);
}
// No bench → full 48 each (fake rotation would invent >48 for someone)
if (homeMin.some((m) => Math.abs(m - 48) > 0.1)) {
  throw new Error(`BB minutes should be 48 each without bench: ${homeMin.join(",")}`);
}
for (const side of [bb1.home, bb1.away]) {
  if (side.totals.reb < 28 || side.totals.reb > 58) {
    throw new Error(`${side.label} REB ${side.totals.reb} out of band 28–58`);
  }
  for (const p of side.players) {
    if (p.reb > 20) throw new Error(`${p.name} REB ${p.reb} absurd`);
    if ((p.position === "C" || p.position === "PF") && p.threeAtt > 8) {
      throw new Error(`${p.name} (${p.position}) 3PA ${p.threeAtt} too high`);
    }
  }
}

const homeFb = pick(fb, 11);
const awayFb = pick(
  fb.filter((p) => !homeFb.some((h) => h.id === p.id)),
  11,
);
const fb1 = simulateFootballMatch(homeFb, awayFb, { seed: 7 });
const fb2 = simulateFootballMatch(homeFb, awayFb, { seed: 7 });
if (JSON.stringify(fb1) !== JSON.stringify(fb2)) {
  throw new Error("Football match not deterministic for same seed");
}
const gSum =
  fb1.home.players.reduce((a, p) => a + p.goals, 0) +
  fb1.away.players.reduce((a, p) => a + p.goals, 0);
if (gSum !== fb1.home.score + fb1.away.score) {
  throw new Error("Football goals not credited to players");
}

console.log(
  `ok bb ${bb1.home.score}-${bb1.away.score} seed=${bb1.seed}; fb ${fb1.home.score}-${fb1.away.score} xG ${fb1.home.xg}-${fb1.away.xg}`,
);
