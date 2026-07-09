#!/usr/bin/env node
import { readFileSync } from "fs";
const s = readFileSync(process.argv[2], "utf8");
const start = s.indexOf("7977:function");
const end = s.indexOf("4496:function", start);
const slice = s.slice(start, end);
const mAssign = slice.indexOf("let m=[");
const dataSection = slice.slice(0, mAssign);
const parts = [];
let pos = 0;
while (true) {
  const i = dataSection.indexOf("JSON.parse('", pos);
  if (i < 0) break;
  const close = dataSection.indexOf("')", i + 12);
  const expr = dataSection.slice(i, close + 2);
  parts.push((0, eval)(expr));
  pos = close + 2;
}
const m = parts.flat();
console.log("batches", parts.length, "sizes", parts.map((p) => p.length));
console.log("total m", m.length);
const pools = new Map();
for (const p of m) pools.set(`${p.team}|${p.decade}`, (pools.get(`${p.team}|${p.decade}`) ?? 0) + 1);
console.log("pools", pools.size, "min", Math.min(...pools.values()), "max", Math.max(...pools.values()));
