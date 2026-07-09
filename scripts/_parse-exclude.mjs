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
      const key = `${club}|${era}`;
      exclude[key] ??= new Set();
      continue;
    }
    const pm = line.match(/b\("([^"]+)"/);
    if (pm && club && era) exclude[`${club}|${era}`].add(pm[1]);
  }
}
console.log("total combos in seeds:", Object.keys(exclude).length);
console.log("Knicks|1960s:", [...(exclude["Knicks|1960s"] ?? [])].join(", "));
