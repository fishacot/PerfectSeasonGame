#!/usr/bin/env node
import { readFileSync } from "fs";
const s = readFileSync(process.argv[2], "utf8");
const start = s.indexOf("7977:function");
const end = s.indexOf("4496:function", start);
const slice = s.slice(start, end);
const idx = slice.indexOf(",m=");
console.log("first ,m= @", idx);
console.log(slice.slice(Math.max(0, idx - 200), idx + 400));
