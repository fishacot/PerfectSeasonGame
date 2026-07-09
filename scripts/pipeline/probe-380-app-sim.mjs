import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = readFileSync(join(__dirname, "..", ".380-chunks", "1x1831masit6n.js"), "utf8");

const needles = [
  "runSimulated",
  "simulateSeason",
  "simulateMatch",
  "winProb",
  "lineStrength",
  "categoryScore",
  "goalkeeper",
  "defence",
  "defense",
  "midfield",
  "attack",
  "balance",
  "gate",
  "exponent",
  "Math.pow",
  "chemistry",
  "formation",
  "ratingUsed",
  "goalsFor",
  "points",
  "114",
  "38",
  "draw",
  "variance",
  "seed",
];

for (const k of needles) {
  let pos = 0;
  let n = 0;
  while (n < 2) {
    const i = app.indexOf(k, pos);
    if (i < 0) break;
    console.log(`\n--- ${k} @${i} ---`);
    console.log(app.slice(Math.max(0, i - 60), i + 280));
    pos = i + k.length;
    n++;
  }
}
