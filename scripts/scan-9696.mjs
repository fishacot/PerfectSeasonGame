#!/usr/bin/env node
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const dir = join(dirname(fileURLToPath(import.meta.url)), ".820-chunks");
const s = readFileSync(join(dir, "9696-6c54a9d9869e047c.js"), "utf8");

for (const id of ["7977", "4496", "9814", "8085"]) {
  let idx = 0;
  while ((idx = s.indexOf(id, idx)) >= 0) {
    console.log(`\n--- ${id} @ ${idx} ---`);
    console.log(s.slice(Math.max(0, idx - 80), idx + 200));
    idx += id.length;
    if (idx > 50000) break;
  }
}

// find r. and d. usage (7977=r, 4496=d)
for (const pat of ["r.", "d.", "o()"]) {
  const re = new RegExp(`${pat}[a-zA-Z_][a-zA-Z0-9_]*`, "g");
  const hits = [...new Set(s.match(re) ?? [])].slice(0, 40);
  console.log(`\n${pat} methods:`, hits.join(", "));
}
