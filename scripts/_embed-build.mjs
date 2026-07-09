import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const depth = JSON.parse(
  fs.readFileSync(path.join(__dirname, "_depth-pools.json"), "utf8"),
);

const depthStr = JSON.stringify(depth, null, 2);

const body = `import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SEED_FILES = [
  "scripts/seeds/nba.ts",
  "scripts/seeds/nba-extra.ts",
  "scripts/seeds/nba-core-boost.ts",
];

const ERAS = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];

/** All 157 club×era combos (30 franchises). */
const TEAM_ERAS = {
  "76ers": ["1980s", "1990s", "2000s", "2010s", "2020s"],
  Bucks: ERAS,
  Bulls: ERAS,
  Cavaliers: ["1990s", "2000s", "2010s", "2020s"],
  Celtics: ERAS,
  Clippers: ERAS,
  Grizzlies: ["2000s", "2010s", "2020s"],
  Hawks: ["1990s", "2000s", "2010s", "2020s"],
  Heat: ["1980s", "1990s", "2000s", "2010s", "2020s"],
  Hornets: ["1990s", "2000s", "2010s", "2020s"],
  Jazz: ["1990s", "2000s", "2010s", "2020s"],
  Kings: ["1990s", "2000s", "2010s", "2020s"],
  Knicks: ERAS,
  Lakers: ERAS,
  Magic: ["1990s", "2000s", "2010s", "2020s"],
  Mavericks: ["1980s", "1990s", "2000s", "2010s", "2020s"],
  Nets: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Nuggets: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Pacers: ["1990s", "2000s", "2010s", "2020s"],
  Pelicans: ["2000s", "2010s", "2020s"],
  Pistons: ["1980s", "1990s", "2000s", "2010s", "2020s"],
  Raptors: ["2000s", "2010s", "2020s"],
  Rockets: ERAS,
  Spurs: ERAS,
  Suns: ERAS,
  Thunder: ERAS,
  Timberwolves: ["1990s", "2000s", "2010s", "2020s"],
  "Trail Blazers": ["1990s", "2000s", "2010s", "2020s"],
  Warriors: ERAS,
  Wizards: ["2000s", "2010s", "2020s"],
};

function loadExisting() {
  const existing = new Map();
  for (const rel of SEED_FILES) {
    const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
    let club = null;
    let era = null;
    for (const line of text.split("\\n")) {
      const cm = line.match(/^  (?:"([^"]+)"|([A-Za-z ]+)): \\{/);
      if (cm) club = cm[1] || cm[2];
      const em = line.match(/"(\\d{4}s)": \\[/);
      if (em) era = em[1];
      const pm = line.match(/b\\("([^"]+)"/);
      if (pm && club && era) {
        const key = \`\${club}|\${era}\`;
        if (!existing.has(key)) existing.set(key, new Set());
        existing.get(key).add(pm[1].trim().toLowerCase());
      }
    }
  }
  return existing;
}

function fmtClub(club) {
  return club.includes(" ") || club.startsWith("7") ? JSON.stringify(club) : club;
}

/** [name, pos, rating, ppg, rpg, apg, spg?, bpg?] */
const depth = ${depthStr};

const existing = loadExisting();
const errors = [];
const dupErrors = [];
const clubs = {};
let combosWritten = 0;

for (const [club, eras] of Object.entries(TEAM_ERAS)) {
  for (const era of eras) {
    const key = \`\${club}|\${era}\`;
    const taken = existing.get(key) ?? new Set();
    const raw = depth[key] ?? [];
    const seen = new Set();
    const filtered = [];

    for (const p of raw) {
      const n = p[0].trim().toLowerCase();
      if (taken.has(n)) {
        dupErrors.push(\`\${key}: duplicate seed player "\${p[0]}"\`);
        continue;
      }
      if (seen.has(n)) continue;
      seen.add(n);
      filtered.push(p);
    }

    if (filtered.length < 8)
      errors.push(\`\${key}: only \${filtered.length} unique depth players\`);
    if (filtered.length > 12) errors.push(\`\${key}: \${filtered.length} players (max 12)\`);
    if (!raw.length) errors.push(\`\${key}: missing from depth pools\`);

    clubs[club] ??= {};
    clubs[club][era] = filtered;
    combosWritten++;
  }
}

const expected = Object.values(TEAM_ERAS).reduce((n, e) => n + e.length, 0);
if (combosWritten !== expected) {
  errors.push(\`expected \${expected} combos, got \${combosWritten}\`);
}

if (errors.length) {
  console.error("VALIDATION ERRORS:\\n" + errors.join("\\n"));
  process.exit(1);
}

function line(p) {
  const [name, pos, ...nums] = p;
  const escaped = name.replace(/\\\\/g, "\\\\\\\\").replace(/"/g, '\\\\"');
  return \`      b("\${escaped}", ["\${pos}"], \${nums.join(", ")})\`;
}

let out = \`import type { ClubEraPool, Seed } from "./types";

const b = (
  name: string,
  positions: string[],
  rating: number,
  ppg: number,
  rpg: number,
  apg: number,
  spg = 1,
  bpg = 0.5,
): Seed => ({
  name,
  positions,
  rating,
  stats: { ppg, rpg, apg, spg, bpg },
});

/** 8-12 rotation/role players per club×era (30 franchises). */
export const NBA_ROSTER_DEPTH: ClubEraPool = {
\`;

for (const [club, eras] of Object.entries(clubs)) {
  out += \`  \${fmtClub(club)}: {\\n\`;
  for (const [era, players] of Object.entries(eras)) {
    out += \`    "\${era}": [\\n\${players.map(line).join(",\\n")},\\n    ],\\n\`;
  }
  out += \`  },\\n\`;
}
out += "};\\n";

const outPath = path.join(ROOT, "scripts/seeds/nba-roster-depth.ts");
fs.writeFileSync(outPath, out);

console.log("wrote", outPath);
console.log("total combos written:", combosWritten);
if (dupErrors.length) {
  console.log("duplicate warnings (filtered out):", dupErrors.length);
  for (const e of dupErrors.slice(0, 20)) console.log(" ", e);
  if (dupErrors.length > 20) console.log("  ...", dupErrors.length - 20, "more");
} else {
  console.log("duplicate warnings: none");
}
`;

fs.writeFileSync(path.join(__dirname, "build-nba-roster-depth.mjs"), body);
console.log("embedded depth keys:", Object.keys(depth).length);
