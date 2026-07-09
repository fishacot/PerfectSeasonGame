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
  const expr = mod.slice(i, close + 2);
  try {
    const data = (0, eval)(expr);
    if (Array.isArray(data) && data[0]?.pts !== undefined) {
      players.push(...data);
      console.log("ok", players.length, "last batch", data.length);
    }
  } catch (e) {
    console.log("fail", e.message.slice(0, 80));
  }
  pos = close + 2;
}
console.log("total", players.length);
