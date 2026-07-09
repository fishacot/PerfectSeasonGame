#!/usr/bin/env node
/**
 * Downloads all 82-0-style NBA player pools from Basketball-Reference.
 * Loops until every franchise×decade pool meets minimum, then rebuilds nba.json.
 *
 * Usage: node scripts/pipeline/download-all-players.mjs
 */
import { spawnSync } from "child_process";
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { allFranchises, requiredPoolMin } = require("./bbr-utils.mjs");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const STATUS = join(ROOT, "data", "raw", "basketball", "download-status.json");
const ERAS = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];

function run(cmd, args) {
  console.log(`\n>>> ${cmd} ${args.join(" ")}`);
  return spawnSync(cmd, args, { cwd: ROOT, stdio: "inherit", shell: true }).status ?? 1;
}

function countGaps() {
  const poolsDir = join(ROOT, "data", "raw", "basketball", "bbr-pools");
  const files = existsSync(poolsDir)
    ? new Set(readdirSync(poolsDir).filter((f) => f.endsWith(".json")))
    : new Set();
  let need = 0;
  let ok = 0;
  const gaps = [];
  for (const club of allFranchises()) {
    for (const era of ERAS) {
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

function writeStatus(extra = {}) {
  const gaps = countGaps();
  const payload = {
    updatedAt: new Date().toISOString(),
    complete: gaps.gaps.length === 0,
    poolsOk: gaps.ok,
    poolsNeed: gaps.need,
    gapsRemaining: gaps.gaps.length,
    gaps: gaps.gaps.slice(0, 30),
    ...extra,
  };
  writeFileSync(STATUS, JSON.stringify(payload, null, 2), "utf8");
  return gaps;
}

let cycle = 0;
let prevOk = -1;

console.log("=== NBA player database download (BBR, 82-0 parity) ===");
writeStatus({ phase: "started" });

while (true) {
  cycle++;
  const before = writeStatus({ phase: "cycle", cycle });
  console.log(`\n=== cycle ${cycle}: ${before.ok}/${before.need} pools, gaps ${before.gaps.length} ===`);

  if (before.gaps.length === 0) break;

  run("node", ["scripts/pipeline/fetch-bbr-seasons.mjs", "--delay", "15000"]);
  run("node", ["scripts/pipeline/build-pools-from-cache.mjs"]);
  run("node", [
    "scripts/pipeline/fetch-bbr-decade-pools.mjs",
    "--all",
    "--missing",
    "--resume",
    "--cache-only",
  ]);

  const after = writeStatus({ phase: "cycle-done", cycle });
  console.log(`cycle ${cycle} result: ${after.ok}/${after.need}, gaps ${after.gaps.length}`);

  if (after.ok === prevOk && after.gaps.length === before.gaps.length) {
    console.log("no progress this cycle — extra cooldown 10 min");
    spawnSync("powershell", ["-Command", "Start-Sleep -Seconds 600"], {
      cwd: ROOT,
      stdio: "inherit",
    });
  }
  prevOk = after.ok;
}

run("npm", ["run", "generate:data"]);
run("npm", ["run", "export:nba-db"]);

const final = writeStatus({ phase: "complete" });
const players = existsSync(join(ROOT, "data", "basketball", "nba-database.json"))
  ? JSON.parse(readFileSync(join(ROOT, "data", "basketball", "nba-database.json"), "utf8"))
  : null;

const summary = {
  completedAt: new Date().toISOString(),
  pools: `${final.ok}/${final.need}`,
  players: players?.meta?.players ?? players?.players?.length ?? 0,
  bbrVerified: players?.meta?.bbrVerified ?? null,
};
writeFileSync(
  join(ROOT, "data", "raw", "basketball", "DOWNLOAD_COMPLETE.json"),
  JSON.stringify(summary, null, 2),
  "utf8",
);

console.log("\n=== ALL PLAYER POOLS DOWNLOADED ===");
console.log(JSON.stringify(summary, null, 2));
