#!/usr/bin/env node
import { readFileSync } from "fs";

const s = readFileSync(process.argv[2], "utf8");
const start = s.indexOf("7977:function");
const end = s.indexOf("4496:function", start);
const mod = s.slice(start, end);

const players = [];
let pos = 0;
while (true) {
  const i = mod.indexOf("JSON.parse('", pos);
  if (i < 0) break;
  const close = mod.indexOf("')", i + 12);
  if (close < 0) break;
  const data = (0, eval)(mod.slice(i, close + 2));
  if (Array.isArray(data) && data[0]?.pts !== undefined) players.push(...data);
  pos = close + 2;
}

const pools = new Map();
for (const p of players) {
  const k = `${p.team}|${p.decade}`;
  pools.set(k, (pools.get(k) ?? 0) + 1);
}
console.log("players", players.length, "unique ids", new Set(players.map(p=>p.id)).size);
console.log("pools", pools.size);
const sorted = [...pools.entries()].sort((a,b)=>b[1]-a[1]);
console.log("top pools", sorted.slice(0,10));
console.log("min pool", Math.min(...sorted.map(x=>x[1])), "max", Math.max(...sorted.map(x=>x[1])));
