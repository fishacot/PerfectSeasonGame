#!/usr/bin/env node
import { readFileSync } from "fs";
const s = readFileSync(process.argv[2], "utf8");
const start = s.indexOf("7977:function");
const end = s.indexOf("4496:function", start);
const slice = s.slice(start, end);
for (const pat of ["Celtics", "Lakers", "rQ=", "TEAM_NAMES", "teamNames", "BOS:", '"BOS"']) {
  const i = slice.indexOf(pat);
  if (i >= 0) console.log(pat, slice.slice(i, i + 150));
}
