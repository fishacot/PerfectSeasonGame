#!/usr/bin/env node
import { readFileSync } from "fs";

const path = process.argv[2];
const s = readFileSync(path, "utf8");
const start = s.indexOf("7977:function");
const end = s.indexOf("4496:function", start);
console.log("7977 slice:", start, "->", end, "len", end - start);
const slice = s.slice(start, Math.min(start + 3000, end > 0 ? end : start + 3000));
console.log(slice);
console.log("\n--- sample names ---");
const names = [...s.matchAll(/name:"([^"]{3,40})"/g)].slice(0, 15).map((m) => m[1]);
console.log(names.join("\n"));
