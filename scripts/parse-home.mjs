#!/usr/bin/env node
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const dir = join(dirname(fileURLToPath(import.meta.url)), ".820-chunks");
const h = readFileSync(join(dir, "home.html"), "utf8");

const all = [...h.matchAll(/(\d{3,5})-([a-f0-9]{8,})\.js/g)];
const byId = new Map();
for (const [, id, hash] of all) byId.set(id, hash);
console.log("numeric chunk hashes from home.html:");
for (const [id, hash] of [...byId.entries()].sort((a, b) => +a[0] - +b[0])) {
  console.log(`  ${id}-${hash}.js`);
}

// RSC references like I[2971,["..."]]
const rsc = [...h.matchAll(/I\[(\d+),/g)].map((m) => m[1]);
console.log("\nRSC chunk refs:", [...new Set(rsc)].join(", "));
