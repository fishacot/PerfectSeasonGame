import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHUNK_DIR = join(__dirname, "..", ".380-chunks");

function scanFile(path) {
  const s = readFileSync(path, "utf8");
  const name = path.split(/[/\\]/).pop();
  const keys = [
    "CLUBS",
    "DECADES",
    "computeOverall",
    "simulate",
    "winCurve",
    "categoryGate",
    "chemistry",
    "nonlinear",
    "computeWins",
    "seasonResult",
    "matchResult",
    "GATE",
    "goals",
    "assists",
    "ALL_SEASONS",
    "Premier",
    "league",
    "38-0",
    "invincible",
  ];
  const hits = keys.filter((k) => s.includes(k));
  if (!hits.length) return null;
  const samples = {};
  for (const k of hits.slice(0, 8)) {
    const i = s.indexOf(k);
    samples[k] = s.slice(Math.max(0, i - 40), i + 220);
  }
  return { name, size: s.length, hits, samples };
}

// org CLUBS export
const org = readFileSync(join(CHUNK_DIR, "03b78z-83yf1m.js"), "utf8");
const clubsIdx = org.indexOf('"CLUBS"');
console.log("=== 38-0.org CLUBS/DECADES ===");
console.log(org.slice(clubsIdx, clubsIdx + 900));

const simKeys = [
  "simulateSeason",
  "runSeason",
  "computeSeason",
  "winProbability",
  "categoryScores",
  "lineStrength",
  "formation",
  "chemistryBonus",
  "gateFloor",
  "exponent",
];
console.log("\n=== org sim keywords ===");
for (const k of simKeys) {
  const i = org.indexOf(k);
  if (i >= 0) console.log(k, "->", org.slice(i, i + 180));
}

console.log("\n=== chunk scan ===");
for (const f of readdirSync(CHUNK_DIR).filter((x) => x.endsWith(".js"))) {
  const r = scanFile(join(CHUNK_DIR, f));
  if (r) {
    console.log(`\n${r.name} (${r.size}) hits: ${r.hits.join(", ")}`);
    for (const [k, v] of Object.entries(r.samples).slice(0, 3)) {
      console.log(`  ${k}: ${v.slice(0, 200)}`);
    }
  }
}

// EPL clubs from app chunk
const app = readFileSync(join(CHUNK_DIR, "44_5ro55mi-yo.js"), "utf8");
const m = app.match(/let r=\[(\{id:"arsenal"[\s\S]{0,8000})/);
if (m) {
  const clubs = [...m[0].matchAll(/name:"([^"]+)"/g)].map((x) => x[1]);
  console.log("\n=== 38-0.app EPL clubs ===", clubs.length);
  console.log(clubs.join(", "));
}
const seasons = app.match(/ALL_SEASONS[^;]{0,400}/);
if (seasons) console.log("\nALL_SEASONS sample:", seasons[0].slice(0, 300));
