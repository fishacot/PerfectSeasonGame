#!/usr/bin/env node
import { readFileSync } from "fs";

const s = readFileSync(process.argv[2], "utf8");
const start = s.indexOf("7977:function");
const end = s.indexOf("4496:function", start);
const mod = s.slice(start, end);

// ponytail: regex scan — handles unicode via \uXXXX in minified source
const re =
  /\{id:"((?:\\.|[^"\\])*)",name:"((?:\\.|[^"\\])*)",team:"((?:\\.|[^"\\])*)",decade:"((?:\\.|[^"\\])*)",positions:\[((?:[^\]]|\](?!\}))*)\],pts:([0-9.]+),reb:([0-9.]+),ast:([0-9.]+),stl:([0-9.]+),blk:([0-9.]+)\}/g;

function unescapeJs(s) {
  return s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

const players = [];
let m;
while ((m = re.exec(mod))) {
  const positions = [...m[5].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  players.push({
    id: unescapeJs(m[1]),
    name: unescapeJs(m[2]),
    team: m[3],
    decade: m[4],
    positions,
    pts: +m[6],
    reb: +m[7],
    ast: +m[8],
    stl: +m[9],
    blk: +m[10],
  });
}
console.log("players:", players.length);
console.log("sample:", players.find((p) => p.name.includes("Joki")) ?? players[0]);
console.log("teams:", [...new Set(players.map((p) => p.team))].sort().join(", "));
