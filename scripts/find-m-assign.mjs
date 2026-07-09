#!/usr/bin/env node
import { readFileSync } from "fs";
const s = readFileSync(process.argv[2], "utf8");
const start = s.indexOf("7977:function");
const end = s.indexOf("4496:function", start);
const slice = s.slice(start, end);
const useM = slice.indexOf("m.map(e=>");
const chunk = slice.slice(0, useM);
// find last assignment to m before use
const patterns = ["let m=", "var m=", ",m=", "m=["];
for (const p of patterns) {
  const i = chunk.lastIndexOf(p);
  if (i >= 0) console.log(p, "last @", i, chunk.slice(i, i + 300));
}
