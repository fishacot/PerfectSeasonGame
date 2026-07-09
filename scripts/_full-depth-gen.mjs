import fs from "fs";

const existing = JSON.parse(fs.readFileSync("scripts/_existing-map.json", "utf8"));

/** @type {Record<string, [string,string,number,number,number,number,number?,number?][]>} */
const POOLS = JSON.parse(fs.readFileSync("scripts/_depth-pools.json", "utf8"));

const errors = [];
const out = {};

for (const [key, players] of Object.entries(POOLS)) {
  const taken = new Set(existing[key] ?? []);
  const seen = new Set();
  const filtered = [];
  for (const p of players) {
    const n = p[0].trim().toLowerCase();
    if (taken.has(n) || seen.has(n)) continue;
    seen.add(n);
    filtered.push(p);
  }
  if (filtered.length < 8) errors.push(`${key}: only ${filtered.length} players (need 8)`);
  if (filtered.length > 12) errors.push(`${key}: ${filtered.length} players (max 12)`);
  out[key] = filtered;
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

let body = `/** [name, pos, rating, ppg, rpg, apg, spg?, bpg?] per "Club|era" */\nexport const moreDepth = ${JSON.stringify(out, null, 2)};\n`;
fs.writeFileSync("scripts/roster-depth-data.mjs", body);
console.log("wrote roster-depth-data.mjs:", Object.keys(out).length, "combos");
