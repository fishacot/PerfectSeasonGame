#!/usr/bin/env node
/**
 * One pipeline cycle: fetch seasons → build pools from cache → rebuild game data.
 * Run in a loop until gaps=0, or use cron.
 */
import { spawnSync } from "child_process";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { allFranchises, clubSeasonsInEra, requiredPoolMin } = require("./bbr-utils.mjs");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

function run(cmd, args) {
  console.log(`\n> ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: "inherit", shell: true });
  return r.status ?? 1;
}

function countGaps() {
  const poolsDir = join(ROOT, "data", "raw", "basketball", "bbr-pools");
  const files = existsSync(poolsDir)
    ? new Set(readdirSync(poolsDir).filter((f) => f.endsWith(".json")))
    : new Set();
  const eras = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
  let need = 0;
  let ok = 0;
  const gaps = [];
  for (const club of allFranchises()) {
    for (const era of eras) {
      const min = requiredPoolMin(club, era);
      if (!min) continue;
      need++;
      const f = `${club}_${era}.json`.replace(/[\\/:*?"<>|]/g, "_");
      if (!files.has(f)) {
        gaps.push(`${club}/${era}`);
        continue;
      }
      const n = JSON.parse(readFileSync(join(poolsDir, f), "utf8")).players?.length ?? 0;
      if (n >= min) ok++;
      else gaps.push(`${club}/${era}=${n}`);
    }
  }
  return { need, ok, gaps };
}

const before = countGaps();
console.log(`pools: ${before.ok}/${before.need} complete, gaps: ${before.gaps.length}`);

run("node", ["scripts/pipeline/fetch-bbr-seasons.mjs", "--delay", "15000"]);
run("node", ["scripts/pipeline/build-pools-from-cache.mjs"]);
run("node", ["scripts/pipeline/fetch-bbr-decade-pools.mjs", "--all", "--missing", "--resume", "--delay", "3000"]);
run("npm", ["run", "generate:data"]);
run("npm", ["run", "export:nba-db"]);

const after = countGaps();
console.log(`\n--- cycle done ---`);
console.log(`pools: ${after.ok}/${after.need} complete (was ${before.ok})`);
console.log(`remaining gaps: ${after.gaps.length}`);
if (after.gaps.length) console.log(after.gaps.slice(0, 15).join(", "), after.gaps.length > 15 ? "…" : "");
