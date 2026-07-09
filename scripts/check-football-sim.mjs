/**
 * Self-check: football season sim (38-0 line balance).
 * Run: npm run check:football-sim
 *
 * ponytail: heuristic bands until extract-380-sim.mjs ports org/app constants.
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const { simulateFootball } = await import(
  "../src/lib/simulation/adapters/football.ts"
);

const players = JSON.parse(
  readFileSync(join(root, "data/football/all.json"), "utf8"),
);

function byLine(pred) {
  return players
    .filter(pred)
    .sort((a, b) => b.rating - a.rating);
}

const gk = byLine((p) => p.positions.includes("GK"));
const def = byLine((p) =>
  p.positions.some((pos) => ["LB", "CB", "RB", "DF"].includes(pos)),
);
const mid = byLine((p) =>
  p.positions.some((pos) =>
    ["CM", "MF", "DM", "AM", "LM", "RM"].includes(pos),
  ),
);
const att = byLine((p) =>
  p.positions.some((pos) =>
    ["LW", "RW", "ST", "FW"].includes(pos),
  ),
);

function takeUnique(pools, counts) {
  const used = new Set();
  const out = [];
  for (let i = 0; i < pools.length; i++) {
    const need = counts[i];
    let taken = 0;
    for (const p of pools[i]) {
      if (used.has(p.id)) continue;
      out.push(p);
      used.add(p.id);
      taken++;
      if (taken >= need) break;
    }
    if (taken < need) {
      throw new Error(`Need ${need} from pool ${i}, got ${taken}`);
    }
  }
  return out;
}

// Strong: top OVR per line (balanced)
const strong = takeUnique([gk, def, mid, att], [1, 4, 3, 3]);
// Unbalanced: elite ATT/GK, but DEF/MID capped low (38-0 punishes weak lines)
const unbalancedBase = takeUnique(
  [gk.slice(0, 3), def.slice(-15), mid.slice(-15), att.slice(0, 8)],
  [1, 4, 3, 3],
);
const unbalanced = unbalancedBase.map((p, i) => {
  // slots: 0 GK, 1-4 DEF, 5-7 MID, 8-10 ATT
  if (i >= 1 && i <= 7) {
    return { ...p, rating: Math.min(p.rating, 58) };
  }
  return p;
});

const slots = ["GK", "LB", "CB", "CB", "RB", "CM", "CM", "CM", "LW", "ST", "RW"];

const strongRes = simulateFootball(strong, 38, slots);
const weakRes = simulateFootball(unbalanced, 38, slots);

console.log(
  `strong ${strongRes.wins}-${strongRes.draws}-${strongRes.losses} pts=${strongRes.wins * 3 + strongRes.draws}`,
);
console.log(
  `unbal  ${weakRes.wins}-${weakRes.draws}-${weakRes.losses} pts=${weakRes.wins * 3 + weakRes.draws}`,
);

if (!(strongRes.wins > weakRes.wins)) {
  throw new Error(
    `Expected strong (${strongRes.wins}) > unbalanced (${weakRes.wins})`,
  );
}
// ponytail: band until org constants extracted — elite balanced XI ~28–37 W
if (strongRes.wins < 28 || strongRes.wins > 37) {
  throw new Error(
    `Strong XI wins ${strongRes.wins} outside band 28–37`,
  );
}
if (strongRes.perfect) {
  throw new Error("Elite fixture must not guarantee perfect 38");
}
if (weakRes.wins > strongRes.wins - 8) {
  throw new Error(
    `Unbalanced XI (${weakRes.wins}) too close to strong (${strongRes.wins})`,
  );
}

console.log("ok football sim self-check");
