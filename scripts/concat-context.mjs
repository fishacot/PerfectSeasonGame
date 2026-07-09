#!/usr/bin/env node
import { readFileSync } from "fs";
const s = readFileSync(process.argv[2], "utf8");
const start = s.indexOf("7977:function");
const end = s.indexOf("4496:function", start);
const slice = s.slice(start, end);
let pos = 0;
let n = 0;
while ((pos = slice.indexOf("concat", pos)) >= 0 && n < 12) {
  console.log(`\n--- concat #${n} @ ${pos} ---`);
  console.log(slice.slice(Math.max(0, pos - 80), pos + 120));
  pos += 6;
  n++;
}
