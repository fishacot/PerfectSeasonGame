#!/usr/bin/env node
import { readFileSync } from "fs";

const s = readFileSync(process.argv[2], "utf8");
const m = s.match(/JSON\.parse\('(\[\{.*?\}\])'\)/);
if (!m) {
  console.error("no player JSON found");
  process.exit(1);
}
const players = JSON.parse(m[1].replace(/\\'/g, "'"));
console.log("players:", players.length);

const teams = [...new Set(players.map((p) => p.team))].sort();
console.log("team abbrs:", teams.join(", "));

// find label map near ER or rQ
for (const pat of ["rQ=function", "ER=function", "Lakers", "Celtics", 'abbr', "TEAMS"]) {
  const i = s.indexOf(pat);
  if (i >= 0) console.log(pat, "@", i, s.slice(i, i + 200));
}
