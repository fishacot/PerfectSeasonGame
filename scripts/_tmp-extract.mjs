import fs from "fs";

const files = [
  "scripts/seeds/nba.ts",
  "scripts/seeds/nba-extra.ts",
  "scripts/seeds/nba-core-boost.ts",
];
const existing = {};

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  let club = null;
  let era = null;
  for (const line of text.split("\n")) {
    const cm = line.match(/^  (?:"([^"]+)"|([A-Za-z ]+)): \{/);
    if (cm) club = cm[1] || cm[2];
    const em = line.match(/"(\d{4}s)": \[/);
    if (em) era = em[1];
    const pm = line.match(/b\("([^"]+)"/);
    if (pm && club && era) {
      const key = `${club}|${era}`;
      if (!existing[key]) existing[key] = [];
      const n = pm[1].trim().toLowerCase();
      if (!existing[key].includes(n)) existing[key].push(n);
    }
  }
}

fs.writeFileSync("scripts/_existing-map.json", JSON.stringify(existing, null, 2));
console.log("wrote", Object.keys(existing).length, "combos");
