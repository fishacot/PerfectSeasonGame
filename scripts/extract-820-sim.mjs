#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const dir = join(dirname(fileURLToPath(import.meta.url)), ".820-chunks");
const patterns = [
  /7977:function/g,
  /4496:function/g,
  /9814:function/g,
  /8085:function/g,
  /\.gv\s*=|function gv\(|exports\.gv/g,
  /Math\.pow\([^)]+\)/g,
  /gateFloor|GATE_|eraAdjust|normalize|baseline|2\.4|0\.85|0\.15|small_ball|twin_towers|run_and_gun/g,
];

for (const f of readdirSync(dir)) {
  if (!f.endsWith(".js")) continue;
  const s = readFileSync(join(dir, f), "utf8");
  for (const p of patterns) {
    if (p.test(s)) {
      console.log(`\n=== ${f} matches ${p} ===`);
      const m = s.match(p);
      console.log("count", m?.length ?? 0);
      if (p.source.includes("7977") || p.source.includes("4496")) {
        const idx = s.indexOf("7977:function") >= 0 ? s.indexOf("7977:function") : s.indexOf("4496:function");
        if (idx >= 0) writeFileSync(join(dir, `${f}.extract.txt`), s.slice(idx, idx + 8000));
      }
    }
  }
}
