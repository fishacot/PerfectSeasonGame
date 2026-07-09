#!/usr/bin/env node
import { readFileSync } from "fs";
const s = readFileSync(process.argv[2], "utf8");
const start = s.indexOf("7977:function");
const end = s.indexOf("4496:function", start);
const mod = s.slice(start, end);
console.log("JSON.parse count", (mod.match(/JSON\.parse/g) || []).length);
console.log("var assignments", [...mod.matchAll(/var \w=JSON\.parse/g)].map(m => m[0]));
