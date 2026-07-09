#!/usr/bin/env node
/**
 * Fetch missing BBR season HTML pages (resume-safe).
 * ponytail: serial fetch + long 429 backoff; upgrade path: proxy rotation.
 *
 * Usage:
 *   node scripts/pipeline/fetch-bbr-seasons.mjs --delay 18000
 *   node scripts/pipeline/fetch-bbr-seasons.mjs --limit 50
 */
import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  readdirSync,
  appendFileSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { allFranchises, clubSeasonsInEra, requiredPoolMin } from "./bbr-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const CACHE_DIR = join(ROOT, "data", "raw", "basketball", "bbr-seasons");
const LOG = join(ROOT, "data", "raw", "basketball", "fetch-seasons-log.txt");
const ERAS = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function log(msg) {
  const line = `${new Date().toISOString()} ${msg}`;
  console.log(msg);
  appendFileSync(LOG, line + "\n", "utf8");
}

function listMissingSeasons() {
  const cached = new Set(
    existsSync(CACHE_DIR)
      ? readdirSync(CACHE_DIR).filter((f) => f.endsWith(".html") || f.endsWith(".missing"))
      : [],
  );
  const jobs = [];
  const seen = new Set();
  for (const club of allFranchises()) {
    for (const era of ERAS) {
      if (!requiredPoolMin(club, era)) continue;
      for (const { abbr, bbrYear } of clubSeasonsInEra(club, era)) {
        const file = `${abbr}_${bbrYear}.html`;
        const missingMarker = `${file}.missing`;
        if (cached.has(file) || cached.has(missingMarker) || seen.has(file)) continue;
        seen.add(file);
        jobs.push({ abbr, bbrYear, file });
      }
    }
  }
  return jobs;
}

async function fetchOne(abbr, bbrYear, retries = 12) {
  const cachePath = join(CACHE_DIR, `${abbr}_${bbrYear}.html`);
  if (existsSync(cachePath)) return "cached";

  const url = `https://www.basketball-reference.com/teams/${abbr}/${bbrYear}.html`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html" },
    redirect: "follow",
  });

  if (res.status === 429) {
    if (retries > 0) {
      const wait = 90_000 + (12 - retries) * 15_000;
      log(`429 ${abbr}/${bbrYear} — wait ${Math.round(wait / 1000)}s (${retries} left)`);
      await sleep(wait);
      return fetchOne(abbr, bbrYear, retries - 1);
    }
    return "rate-limited";
  }
  if (res.status === 404) {
    mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(`${cachePath}.missing`, "", "utf8");
    return "404";
  }
  if (!res.ok) return `http-${res.status}`;

  const html = await res.text();
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(cachePath, html, "utf8");
  return "ok";
}

function parseArgs(argv) {
  const args = { delay: 18_000, limit: 0 };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--delay") args.delay = parseInt(argv[++i], 10);
    else if (argv[i] === "--limit") args.limit = parseInt(argv[++i], 10);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  const jobs = listMissingSeasons();
  const todo = args.limit > 0 ? jobs.slice(0, args.limit) : jobs;
  log(`missing seasons: ${jobs.length}, fetching: ${todo.length}, delay ${args.delay}ms`);

  let ok = 0;
  let fail = 0;
  for (let i = 0; i < todo.length; i++) {
    const { abbr, bbrYear, file } = todo[i];
    process.stdout.write(`[${i + 1}/${todo.length}] ${file}… `);
    const result = await fetchOne(abbr, bbrYear);
    console.log(result);
    if (result === "ok" || result === "cached") ok++;
    else fail++;
    if (i < todo.length - 1 && result !== "rate-limited") await sleep(args.delay);
    if (result === "rate-limited") {
      log("persistent 429 — cooling down 5 min, retry same page");
      await sleep(300_000);
      i--;
      continue;
    }
  }

  log(`done: ok=${ok} fail=${fail} remaining=${listMissingSeasons().length}`);
}

main().catch((e) => {
  log(`fatal: ${e.message}`);
  process.exit(1);
});
