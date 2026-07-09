/** Generates football/hockey boost seed files from compact tuples. Run: node scripts/build-fb-hk-boost.mjs */
import fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// [name, positions, rating, goals, assists, cleanSheets?]
const fb = (name, pos, rating, g, a, cs = 0) =>
  `      f(${JSON.stringify(name)}, ${JSON.stringify(pos)}, ${rating}, ${g}, ${a}${cs ? `, ${cs}` : ""}),`;

const hk = (name, pos, rating, g, a, sv = 0) =>
  `      h(${JSON.stringify(name)}, ${JSON.stringify(pos)}, ${rating}, ${g}, ${a}${sv ? `, ${sv}` : ""}),`;

function emitFootballBoost(pool, helper, sportLabel) {
  const lines = [
    `import type { ClubEraPool, Seed } from "./types";`,
    ``,
    `const f = (`,
    `  name: string,`,
    `  positions: string[],`,
    `  rating: number,`,
    `  goals: number,`,
    `  assists: number,`,
    `  cleanSheets = 0,`,
    `): Seed => ({`,
    `  name,`,
    `  positions,`,
    `  rating,`,
    `  stats: positions.includes("GK")`,
    `    ? { goals: 0, assists: 0, cleanSheets }`,
    `    : { goals, assists },`,
    `});`,
    ``,
    `/** ${sportLabel} */`,
    `export const ${pool}: ClubEraPool = {`,
  ];
  for (const [club, eras] of Object.entries(pool === "FOOTBALL_CORE_BOOST" ? FOOTBALL_BOOST : FOOTBALL_EPL_EXTRA)) {
    lines.push(`  ${JSON.stringify(club)}: {`);
    for (const [era, players] of Object.entries(eras)) {
      lines.push(`    ${JSON.stringify(era)}: [`);
      for (const p of players) lines.push(helper(...p));
      lines.push(`    ],`);
    }
    lines.push(`  },`);
  }
  lines.push(`};`, ``);
  return lines.join("\n");
}

function emitHockeyBoost(poolName, data, label) {
  const lines = [
    `import type { ClubEraPool, Seed } from "./types";`,
    ``,
    `const h = (`,
    `  name: string,`,
    `  positions: string[],`,
    `  rating: number,`,
    `  goals: number,`,
    `  assists: number,`,
    `  savePct = 0,`,
    `): Seed => ({`,
    `  name,`,
    `  positions,`,
    `  rating,`,
    `  stats: { goals, assists, savePct },`,
    `});`,
    ``,
    `/** ${label} */`,
    `export const ${poolName}: ClubEraPool = {`,
  ];
  for (const [club, eras] of Object.entries(data)) {
    lines.push(`  ${club.includes(" ") ? JSON.stringify(club) : club}: {`);
    for (const [era, players] of Object.entries(eras)) {
      lines.push(`    ${JSON.stringify(era)}: [`);
      for (const p of players) lines.push(hk(...p));
      lines.push(`    ],`);
    }
    lines.push(`  },`);
  }
  lines.push(`};`, ``);
  return lines.join("\n");
}

// +2 depth per existing football club×era (key: "Club|era")
const FOOTBALL_BOOST = {
  Arsenal: {
    "1990s": [["Nigel Winterburn", ["LB", "DF"], 84, 2, 5], ["David Seaman", ["GK"], 90, 0, 0, 17]],
    "2000s": [["Sol Campbell", ["CB", "DF"], 88, 3, 1], ["Freddie Ljungberg", ["RW", "FW"], 86, 10, 8]],
    "2010s": [["Theo Walcott", ["RW", "FW"], 84, 12, 6], ["Petr Cech", ["GK"], 87, 0, 0, 14]],
    "2020s": [["Gabriel Magalhaes", ["CB", "DF"], 85, 3, 1], ["Aaron Ramsdale", ["GK"], 84, 0, 0, 12]],
  },
  "Manchester United": {
    "1990s": [["Andy Cole", ["ST", "FW"], 88, 22, 6], ["Gary Neville", ["RB", "DF"], 86, 2, 6]],
    "2000s": [["Nemanja Vidic", ["CB", "DF"], 89, 3, 1], ["Carlos Tevez", ["ST", "FW"], 87, 18, 6]],
    "2010s": [["Juan Mata", ["CM", "MF"], 86, 8, 10], ["Victor Lindelof", ["CB", "DF"], 84, 2, 1]],
    "2020s": [["Luke Shaw", ["LB", "DF"], 85, 2, 6], ["Andre Onana", ["GK"], 84, 0, 0, 11]],
  },
  Liverpool: {
    "1990s": [["Steve McManaman", ["RW", "FW"], 85, 8, 12], ["Bruce Grobbelaar", ["GK"], 84, 0, 0, 12]],
    "2000s": [["Dirk Kuyt", ["ST", "FW"], 85, 14, 6], ["Pepe Reina", ["GK"], 87, 0, 0, 15]],
    "2010s": [["James Milner", ["CM", "MF"], 85, 6, 8], ["Andy Robertson", ["LB", "DF"], 87, 3, 10]],
    "2020s": [["Cody Gakpo", ["LW", "FW"], 84, 12, 6], ["Trent Alexander-Arnold", ["RB", "DF"], 87, 4, 12]],
  },
  "Manchester City": {
    "1990s": [["Niall Quinn", ["ST", "FW"], 82, 12, 4], ["Andy Morrison", ["CB", "DF"], 80, 2, 1]],
    "2000s": [["Carlos Tevez", ["ST", "FW"], 88, 20, 6], ["Joe Hart", ["GK"], 86, 0, 0, 14]],
    "2010s": [["Raheem Sterling", ["RW", "FW"], 88, 18, 10], ["Aymeric Laporte", ["CB", "DF"], 87, 3, 1]],
    "2020s": [["Bernardo Silva", ["CM", "MF"], 89, 8, 10], ["Ruben Dias", ["CB", "DF"], 88, 2, 1]],
  },
  Chelsea: {
    "1990s": [["Ruud Gullit", ["CM", "MF"], 88, 10, 10], ["Mark Hughes", ["ST", "FW"], 86, 14, 5]],
    "2000s": [["Michael Essien", ["CM", "MF"], 88, 6, 5], ["Ashley Cole", ["LB", "DF"], 88, 2, 6]],
    "2010s": [["Willian", ["RW", "FW"], 86, 10, 10], ["Thibaut Courtois", ["GK"], 89, 0, 0, 16]],
    "2020s": [["Reece James", ["RB", "DF"], 86, 4, 6], ["Robert Sanchez", ["GK"], 83, 0, 0, 11]],
  },
  Tottenham: {
    "1990s": [["Jurgen Klinsmann", ["ST", "FW"], 88, 18, 6], ["Sol Campbell", ["CB", "DF"], 87, 3, 1]],
    "2000s": [["Aaron Lennon", ["RW", "FW"], 84, 8, 8], ["Paul Robinson", ["GK"], 84, 0, 0, 13]],
    "2010s": [["Dele Alli", ["CM", "MF"], 86, 12, 8], ["Jan Vertonghen", ["CB", "DF"], 86, 4, 2]],
    "2020s": [["Richarlison", ["ST", "FW"], 84, 12, 4], ["Guglielmo Vicario", ["GK"], 84, 0, 0, 12]],
  },
  Newcastle: {
    "1990s": [["Les Ferdinand", ["ST", "FW"], 87, 18, 5], ["Rob Lee", ["CM", "MF"], 84, 8, 6]],
    "2000s": [["Michael Owen", ["ST", "FW"], 86, 16, 4], ["Nicky Butt", ["CM", "MF"], 83, 4, 4]],
    "2010s": [["Demba Ba", ["ST", "FW"], 84, 14, 3], ["Moussa Sissoko", ["CM", "MF"], 83, 5, 5]],
    "2020s": [["Kieran Trippier", ["RB", "DF"], 86, 3, 8], ["Sven Botman", ["CB", "DF"], 84, 2, 1]],
  },
  "Aston Villa": {
    "1990s": [["Gareth Southgate", ["CB", "DF"], 82, 1, 1], ["Ugo Ehiogu", ["CB", "DF"], 83, 2, 1]],
    "2000s": [["Stiliyan Petrov", ["CM", "MF"], 85, 6, 6], ["Gabriel Agbonlahor", ["ST", "FW"], 83, 12, 4]],
    "2010s": [["Jack Grealish", ["LW", "FW"], 86, 8, 10], ["Tyrone Mings", ["CB", "DF"], 83, 2, 1]],
    "2020s": [["Leon Bailey", ["RW", "FW"], 84, 10, 6], ["Pau Torres", ["CB", "DF"], 85, 2, 1]],
  },
};

// part 2 written to separate json for size — merged below at runtime from part files
const boostPart2Path = join(root, "scripts", "fb-boost-part2.json");
const eplExtraPath = join(root, "scripts", "fb-epl-extra.json");
const leaguesExtraPath = join(root, "scripts", "fb-leagues-extra.json");
const hkBoostPath = join(root, "scripts", "hk-boost.json");
const hkExtraPath = join(root, "scripts", "hk-extra.json");
const hkPart3Path = join(root, "scripts", "hk-part3.json");

function mergeFootballBoost() {
  const merged = { ...FOOTBALL_BOOST };
  if (fs.existsSync(boostPart2Path)) Object.assign(merged, JSON.parse(fs.readFileSync(boostPart2Path, "utf8")));
  return merged;
}

function writeFootballCoreBoost() {
  const data = mergeFootballBoost();
  const lines = [
    `import type { ClubEraPool, Seed } from "./types";`,
    `const f = (name: string, positions: string[], rating: number, goals: number, assists: number, cleanSheets = 0): Seed => ({ name, positions, rating, stats: positions.includes("GK") ? { goals: 0, assists: 0, cleanSheets } : { goals, assists } });`,
    `/** +2 depth per existing football club×era pool. */`,
    `export const FOOTBALL_CORE_BOOST: ClubEraPool = {`,
  ];
  for (const [club, eras] of Object.entries(data)) {
    lines.push(`  ${JSON.stringify(club)}: {`);
    for (const [era, players] of Object.entries(eras)) {
      lines.push(`    ${JSON.stringify(era)}: [`);
      for (const p of players) lines.push(fb(...p));
      lines.push(`    ],`);
    }
    lines.push(`  },`);
  }
  lines.push(`};`, ``);
  fs.writeFileSync(join(root, "scripts", "seeds", "football-core-boost.ts"), lines.join("\n"));
}

function writeFootballExtra(name, dataPath, exportName, label) {
  if (!fs.existsSync(dataPath)) return;
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const lines = [
    `import type { ClubEraPool, Seed } from "./types";`,
    `const f = (name: string, positions: string[], rating: number, goals: number, assists: number, cleanSheets = 0): Seed => ({ name, positions, rating, stats: positions.includes("GK") ? { goals: 0, assists: 0, cleanSheets } : { goals, assists } });`,
    `/** ${label} */`,
    `export const ${exportName}: ClubEraPool = {`,
  ];
  for (const [club, eras] of Object.entries(data)) {
    lines.push(`  ${JSON.stringify(club)}: {`);
    for (const [era, players] of Object.entries(eras)) {
      lines.push(`    ${JSON.stringify(era)}: [`);
      for (const p of players) lines.push(fb(...p));
      lines.push(`    ],`);
    }
    lines.push(`  },`);
  }
  lines.push(`};`, ``);
  fs.writeFileSync(join(root, "scripts", "seeds", name), lines.join("\n"));
}

function writeHockey(name, dataPath, exportName, label) {
  if (!fs.existsSync(dataPath)) return;
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  fs.writeFileSync(join(root, "scripts", "seeds", name), emitHockeyBoost(exportName, data, label));
}

writeFootballCoreBoost();
writeFootballExtra("football-epl-extra.ts", eplExtraPath, "FOOTBALL_EPL_EXTRA", "EPL expansion clubs — 6 players per era");
writeFootballExtra("football-leagues-extra.ts", leaguesExtraPath, "FOOTBALL_LEAGUES_EXTRA", "Top-5 league expansion — 6 players per era");
writeHockey("hockey-core-boost.ts", hkBoostPath, "HOCKEY_CORE_BOOST", "+2 depth per existing NHL club×era");
writeHockey("hockey-extra.ts", hkExtraPath, "HOCKEY_EXTRA", "Additional NHL franchises");
writeHockey("hockey-part3.ts", hkPart3Path, "HOCKEY_PART3", "Remaining NHL franchises to 32");
console.log("boost seeds generated");
