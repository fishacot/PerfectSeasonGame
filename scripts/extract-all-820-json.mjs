#!/usr/bin/env node
import { readFileSync } from "fs";

const s = readFileSync(process.argv[2], "utf8");
const start = s.indexOf("7977:function");
const end = s.indexOf("4496:function", start);
const mod = s.slice(start, end);

let pos = 0;
const all = [];
while (true) {
  const i = mod.indexOf("JSON.parse('", pos);
  if (i < 0) break;
  let j = i + 12;
  let depth = 0;
  let inStr = false;
  let esc = false;
  // find matching closing quote before );
  const bodyStart = j;
  for (; j < mod.length; j++) {
    const c = mod[j];
    if (esc) { esc = false; continue; }
    if (c === "\\") { esc = true; continue; }
    if (c === "'") break;
  }
  const raw = mod.slice(bodyStart, j);
  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data) && data[0]?.name && data[0]?.pts !== undefined) {
      all.push(...data);
      console.log("array @", i, "len", data.length);
    } else if (Array.isArray(data)) {
      console.log("non-player array @", i, "len", data.length, "sample", JSON.stringify(data[0]).slice(0, 80));
    } else {
      console.log("object @", i, JSON.stringify(data).slice(0, 120));
    }
  } catch (e) {
    console.log("parse fail @", i, e.message, raw.slice(0, 60));
  }
  pos = j + 1;
}
console.log("\ntotal players:", all.length);
console.log("teams:", [...new Set(all.map((p) => p.team))].sort().join(", "));
