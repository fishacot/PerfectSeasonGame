#!/usr/bin/env node
import { readFileSync } from "fs";
const mod = readFileSync(process.argv[2], "utf8");
const start = mod.indexOf("7977:function");
const end = mod.indexOf("4496:function", start);
const slice = mod.slice(start, end);
for (const pat of ["concat", "push.apply", ".push(", "var t=", "let t=", "t=t"]){
  const n = (slice.match(new RegExp(pat.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'g')) || []).length;
  console.log(pat, n);
}
// show context around var t=
const i = slice.indexOf("var t=JSON.parse");
console.log("\ncontext:", slice.slice(i, i+500));
const j = slice.indexOf("function playersFor");
console.log("\nplayersFor@", j, slice.slice(j, j+300));
