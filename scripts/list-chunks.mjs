#!/usr/bin/env node
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const dir = join(dirname(fileURLToPath(import.meta.url)), ".820-chunks");
const h = readFileSync(join(dir, "home.html"), "utf8");
const chunks = [...new Set([...h.matchAll(/chunks\/([^"']+\.js)/g)].map((m) => m[1]))];
console.log(chunks.join("\n"));
