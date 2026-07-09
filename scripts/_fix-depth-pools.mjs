import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SEED_FILES = [
  "scripts/seeds/nba.ts",
  "scripts/seeds/nba-extra.ts",
  "scripts/seeds/nba-core-boost.ts",
];

const TEAM_ERAS = {
  "76ers": ["1980s", "1990s", "2000s", "2010s", "2020s"],
  Bucks: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Bulls: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Cavaliers: ["1990s", "2000s", "2010s", "2020s"],
  Celtics: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Clippers: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Grizzlies: ["2000s", "2010s", "2020s"],
  Hawks: ["1990s", "2000s", "2010s", "2020s"],
  Heat: ["1980s", "1990s", "2000s", "2010s", "2020s"],
  Hornets: ["1990s", "2000s", "2010s", "2020s"],
  Jazz: ["1990s", "2000s", "2010s", "2020s"],
  Kings: ["1990s", "2000s", "2010s", "2020s"],
  Knicks: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Lakers: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Magic: ["1990s", "2000s", "2010s", "2020s"],
  Mavericks: ["1980s", "1990s", "2000s", "2010s", "2020s"],
  Nets: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Nuggets: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Pacers: ["1990s", "2000s", "2010s", "2020s"],
  Pelicans: ["2000s", "2010s", "2020s"],
  Pistons: ["1980s", "1990s", "2000s", "2010s", "2020s"],
  Raptors: ["2000s", "2010s", "2020s"],
  Rockets: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Spurs: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Suns: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Thunder: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Timberwolves: ["1990s", "2000s", "2010s", "2020s"],
  "Trail Blazers": ["1990s", "2000s", "2010s", "2020s"],
  Warriors: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Wizards: ["2000s", "2010s", "2020s"],
};

function loadExisting() {
  const existing = new Map();
  for (const rel of SEED_FILES) {
    const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
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
        if (!existing.has(key)) existing.set(key, new Set());
        existing.get(key).add(pm[1].trim().toLowerCase());
      }
    }
  }
  return existing;
}

const p = (n, pos, r, ppg, rpg, apg, spg = 1, bpg = 0.5) =>
  [n, pos, r, ppg, rpg, apg, spg, bpg];

/** ponytail: generic era backups when franchise pool bleeds into seeds */
const BACKUPS = {
  "1960s": [
    p("Don Ohl", "SG", 78, 12, 3, 3, 0.8, 0.2),
    p("Gary Keller", "C", 76, 8, 7, 1, 0.4, 0.8),
    p("Jim Barnett", "SG", 78, 12, 4, 3, 0.8, 0.2),
    p("John Barnhill", "PG", 76, 9, 3, 4, 0.8, 0.2),
    p("Darrall Imhoff", "C", 77, 10, 8, 1, 0.4, 1),
    p("Fred Crawford", "SG", 77, 12, 4, 2, 0.8, 0.3),
  ],
  "1970s": [
    p("Mike Newlin", "SG", 80, 14, 4, 4, 0.8, 0.3),
    p("Harvey Catchings", "PF", 77, 8, 7, 2, 0.6, 0.8),
    p("Kevin Kunnert", "C", 76, 8, 7, 1, 0.3, 0.8),
    p("Wilbur Holland", "PG", 77, 12, 3, 5, 1.2, 0.2),
    p("John Mengelt", "SG", 77, 12, 3, 4, 0.8, 0.2),
    p("Tom Henderson", "PG", 76, 8, 3, 5, 0.8, 0.2),
  ],
  "1980s": [
    p("Brad Davis", "PG", 79, 10, 3, 7, 0.8, 0.2),
    p("Mike Sanders", "SF", 78, 12, 5, 2, 0.6, 0.4),
    p("Ed Nealy", "PF", 75, 6, 5, 2, 0.4, 0.3),
    p("Jay Humphries", "PG", 77, 10, 3, 5, 1, 0.2),
    p("Scott Skiles", "PG", 78, 12, 3, 7, 0.8, 0.2),
    p("Kenny Walker", "SF", 80, 12, 5, 2, 0.8, 0.5),
  ],
  "1990s": [
    p("David Wingate", "SG", 76, 10, 4, 3, 0.8, 0.3),
    p("Tony Smith", "PG", 75, 8, 3, 4, 0.8, 0.2),
    p("Matt Geiger", "C", 76, 8, 7, 1, 0.3, 1),
    p("David Benoit", "PF", 77, 10, 6, 1, 0.5, 0.4),
    p("Greg Foster", "C", 76, 6, 6, 1, 0.3, 1),
    p("Walt Williams", "SF", 78, 12, 4, 3, 0.8, 0.3),
  ],
  "2000s": [
    p("Aaron Brooks", "PG", 78, 12, 2, 4, 0.6, 0.2),
    p("Matt Bonner", "PF", 76, 8, 5, 1, 0.4, 0.3),
    p("Brian Skinner", "PF", 76, 8, 6, 1, 0.4, 0.6),
    p("Daniel Gibson", "PG", 78, 12, 3, 3, 0.8, 0.2),
    p("James Singleton", "PF", 75, 7, 5, 1, 0.4, 0.3),
    p("Quinton Ross", "SG", 76, 6, 3, 2, 0.8, 0.4),
  ],
  "2010s": [
    p("Langston Galloway", "PG", 77, 10, 3, 3, 0.6, 0.2),
    p("Jon Leuer", "PF", 76, 8, 5, 1, 0.4, 0.3),
    p("E'Twaun Moore", "SG", 77, 10, 3, 2, 0.6, 0.2),
    p("Darius Miller", "SF", 76, 8, 4, 2, 0.5, 0.3),
    p("Wayne Ellington", "SG", 77, 10, 3, 2, 0.5, 0.2),
    p("Garrett Temple", "SG", 76, 8, 3, 3, 0.6, 0.3),
  ],
  "2020s": [
    p("Craig Porter Jr.", "PG", 75, 7, 3, 3, 0.8, 0.3),
    p("Jordan Walsh", "SF", 75, 6, 4, 1, 0.6, 0.4),
    p("Cam Whitmore", "SF", 76, 10, 4, 1, 0.6, 0.3),
    p("Gradey Dick", "SG", 76, 9, 3, 2, 0.5, 0.2),
    p("Olivier-Maxence Prosper", "SF", 75, 6, 4, 1, 0.5, 0.3),
    p("Nick Smith Jr.", "SG", 76, 10, 2, 3, 0.6, 0.2),
  ],
};

const existing = loadExisting();
const pools = JSON.parse(
  fs.readFileSync(path.join(__dirname, "_depth-pools.json"), "utf8"),
);

const globalUsed = new Set();
for (const taken of existing.values()) {
  for (const n of taken) globalUsed.add(n);
}

let padded = 0;
for (const [club, eras] of Object.entries(TEAM_ERAS)) {
  for (const era of eras) {
    const key = `${club}|${era}`;
    const taken = existing.get(key) ?? new Set();
    const raw = pools[key] ?? [];
    const seen = new Set();
    const filtered = [];
    for (const pl of raw) {
      const n = pl[0].trim().toLowerCase();
      if (taken.has(n) || seen.has(n)) continue;
      seen.add(n);
      filtered.push(pl);
    }
    if (filtered.length >= 8) {
      pools[key] = filtered.slice(0, 12);
      continue;
    }
    for (const backup of BACKUPS[era] ?? []) {
      if (filtered.length >= 8) break;
      const n = backup[0].trim().toLowerCase();
      if (taken.has(n) || seen.has(n)) continue;
      seen.add(n);
      filtered.push(backup);
      padded++;
    }
    pools[key] = filtered;
  }
}

const errors = [];
for (const [club, eras] of Object.entries(TEAM_ERAS)) {
  for (const era of eras) {
    const key = `${club}|${era}`;
    const n = (pools[key] ?? []).length;
    if (n < 8) errors.push(`${key}: ${n} after pad`);
  }
}

fs.writeFileSync(
  path.join(__dirname, "_depth-pools.json"),
  JSON.stringify(pools, null, 2),
);
console.log("padded entries:", padded);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("all", Object.keys(pools).length, "combos ok");
