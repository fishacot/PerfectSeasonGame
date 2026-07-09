import fs from "fs";

const files = [
  "scripts/seeds/nba.ts",
  "scripts/seeds/nba-extra.ts",
  "scripts/seeds/nba-core-boost.ts",
];
const exclude = {};
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  let club = null;
  let era = null;
  for (const line of src.split("\n")) {
    const cm = line.match(/^  ("?[\w ]+"?|\d+ers): \{/);
    if (cm) {
      club = cm[1].replace(/"/g, "");
      era = null;
      continue;
    }
    const em = line.match(/^    "(\d{4}s)": \[/);
    if (em && club) {
      era = em[1];
      exclude[`${club}|${era}`] ??= new Set();
      continue;
    }
    const pm = line.match(/b\("([^"]+)"/);
    if (pm && club && era) exclude[`${club}|${era}`].add(pm[1]);
  }
}
const out = {};
for (const [k, v] of Object.entries(exclude)) out[k] = [...v].sort();
fs.writeFileSync("scripts/_exclude.json", JSON.stringify(out, null, 2));
console.log(Object.keys(out).length);
