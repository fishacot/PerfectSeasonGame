#!/usr/bin/env node
/** Smoke: core modules load and self-checks pass. */
import { spawnSync } from "child_process";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const checks = [
  ["engine", "src/lib/simulation/basketball/engine.ts"],
  ["grade", "src/lib/simulation/grade.ts"],
  ["bot-draft", "src/lib/game/bot-draft.ts"],
  ["spin-timing", "src/lib/game/spin-timing.ts"],
];

for (const [name, file] of checks) {
  const r = spawnSync("npx", ["tsx", file], { cwd: root, stdio: "inherit", shell: true });
  if (r.status !== 0) {
    console.error(`smoke failed: ${name}`);
    process.exit(1);
  }
}

const assets = [
  "public/players/basketball/_default.webp",
  "public/backgrounds/basketball-arena.webp",
  "public/textures/parquet.webp",
];
for (const a of assets) {
  if (!existsSync(join(root, a))) {
    console.error(`missing asset: ${a}`);
    process.exit(1);
  }
}

console.log("smoke-check ok");
