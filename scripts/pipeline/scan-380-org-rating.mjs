import { readFileSync } from "fs";

const CHUNK =
  process.argv[2] ??
  "C:/Users/user/.cursor/projects/c-Users-user-Desktop-3/agent-tools/22f14376-b906-4dd8-ba83-e75173d2fa04.txt";

const s = readFileSync(CHUNK, "utf8");

const needles = [
  "overall",
  "ovr",
  "OVR",
  "rating",
  "attack",
  "goalkeeping",
  "compute",
  "getPlayer",
  "function l(",
  "playerRating",
  "areaStats",
  "goals",
  "assists",
];

for (const k of needles) {
  let pos = 0;
  let n = 0;
  while (n < 3) {
    const i = s.indexOf(k, pos);
    if (i < 0) break;
    console.log(`\n--- ${k} @${i} ---`);
    console.log(s.slice(Math.max(0, i - 80), i + 200));
    pos = i + k.length;
    n++;
  }
}

// Find player factory definition
const factoryIdx = s.indexOf("function l(");
if (factoryIdx >= 0) {
  console.log("\n=== factory l ===");
  console.log(s.slice(factoryIdx, factoryIdx + 800));
}
