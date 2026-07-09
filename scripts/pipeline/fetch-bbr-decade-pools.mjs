#!/usr/bin/env node
/**
 * Fetches Basketball-Reference per-game stats for every franchise×decade pool.
 * Output: data/raw/basketball/bbr-pools/{club}|{era}.json
 *
 * Usage:
 *   node scripts/pipeline/fetch-bbr-decade-pools.mjs --club Lakers --era 2010s
 *   node scripts/pipeline/fetch-bbr-decade-pools.mjs --all
 *   node scripts/pipeline/fetch-bbr-decade-pools.mjs --all --delay 2500
 */
import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  readdirSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  allFranchises,
  clubSeasonsInEra,
  parsePerGameTable,
  mergeDecadePlayers,
  bbrYearToSeasonStart,
  requiredPoolMin,
  POOL_MIN,
} from "./bbr-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const OUT_DIR = join(ROOT, "data", "raw", "basketball", "bbr-pools");
const CACHE_DIR = join(ROOT, "data", "raw", "basketball", "bbr-seasons");
const ERAS = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];

const UA =
  "PerfectSeasonHub/1.0 (research; contact: local-dev) Node-fetch BBR decade pool importer";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function seasonLabel(bbrYear) {
  const start = bbrYearToSeasonStart(bbrYear);
  const end = String(start + 1).slice(-2);
  return `${start}-${end}`;
}

async function fetchSeasonHtml(abbr, bbrYear, cacheOnly = false, retries = 5) {
  const cachePath = join(CACHE_DIR, `${abbr}_${bbrYear}.html`);
  if (existsSync(cachePath)) {
    return { html: readFileSync(cachePath, "utf8"), fromCache: true };
  }
  if (existsSync(`${cachePath}.missing`) || cacheOnly) return null;

  const url = `https://www.basketball-reference.com/teams/${abbr}/${bbrYear}.html`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html" },
    redirect: "follow",
  });

  if (res.status === 429) {
    if (retries > 0) {
      await sleep(90_000 + (6 - retries) * 15_000);
      return fetchSeasonHtml(abbr, bbrYear, retries - 1);
    }
    return null;
  }
  if (res.status === 404) {
    writeFileSync(`${cachePath}.missing`, "", "utf8");
    return null;
  }
  if (!res.ok) throw new Error(`BBR ${url} → HTTP ${res.status}`);

  const html = await res.text();
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(cachePath, html, "utf8");
  return { html, fromCache: false };
}

async function buildPool(club, era, delayMs, cacheOnly = false) {
  const seasons = clubSeasonsInEra(club, era);
  if (seasons.length === 0) {
    return { club, era, players: [], skipped: true, reason: "no seasons in era" };
  }

  const seasonRows = [];
  for (const { bbrYear, abbr } of seasons) {
    try {
      const fetched = await fetchSeasonHtml(abbr, bbrYear, cacheOnly);
      if (delayMs > 0 && fetched && !fetched.fromCache) await sleep(delayMs);
      if (!fetched?.html) continue;

      const parsed = parsePerGameTable(fetched.html);
      if (parsed.length === 0) continue;

      seasonRows.push({
        season: seasonLabel(bbrYear),
        abbr,
        bbrYear,
        players: parsed,
      });
    } catch (e) {
      console.error(`  skip ${abbr}/${bbrYear}: ${e.message}`);
    }
  }

  const merged = mergeDecadePlayers(seasonRows);
  return {
    club,
    era,
    fetchedAt: new Date().toISOString(),
    source: "basketball-reference.com",
    seasons: seasonRows.map((s) => ({
      season: s.season,
      abbr: s.abbr,
      count: s.players.length,
    })),
    players: merged.map((p) => ({
      name: p.name,
      positions: p.positions,
      season: p.season,
      stats: p.stats,
      rating: undefined,
    })),
  };
}

function poolPath(club, era) {
  const safe = `${club}|${era}`.replace(/[\\/:*?"<>|]/g, "_");
  return join(OUT_DIR, `${safe}.json`);
}

async function writePool(club, era, delayMs, cacheOnly = false) {
  const out = await buildPool(club, era, delayMs, cacheOnly);
  out.players = out.players.map((p) => ({
    ...p,
    rating:
      p.rating ??
      Math.min(
        99,
        Math.max(
          50,
          Math.round(
            50 +
              2.2 * p.stats.ppg +
              0.9 * p.stats.rpg +
              1.1 * p.stats.apg +
              2 * p.stats.spg +
              1.5 * p.stats.bpg,
          ),
        ),
      ),
  }));

  mkdirSync(OUT_DIR, { recursive: true });
  if (out.players?.length) {
    writeFileSync(poolPath(club, era), JSON.stringify(out, null, 2), "utf8");
  }
  return out;
}

function parseArgs(argv) {
  const args = { all: false, delay: 2200, club: null, era: null, resume: false, missing: false, cacheOnly: false };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--all") args.all = true;
    else if (argv[i] === "--resume") args.resume = true;
    else if (argv[i] === "--missing") args.missing = true;
    else if (argv[i] === "--cache-only") args.cacheOnly = true;
    else if (argv[i] === "--delay") args.delay = parseInt(argv[++i], 10);
    else if (argv[i] === "--club") args.club = argv[++i];
    else if (argv[i] === "--era") args.era = argv[++i];
  }
  return args;
}

function poolIsComplete(club, era) {
  const min = requiredPoolMin(club, era);
  if (min === 0) return true;
  const path = poolPath(club, era);
  if (!existsSync(path)) return false;
  const raw = JSON.parse(readFileSync(path, "utf8"));
  return (raw.players?.length ?? 0) >= min;
}

async function main() {
  const args = parseArgs(process.argv);
  const jobs = [];

  if (args.club && args.era) {
    jobs.push([args.club, args.era]);
  } else if (args.all) {
    for (const club of allFranchises()) {
      for (const era of ERAS) {
        if (args.missing && poolIsComplete(club, era)) continue;
        jobs.push([club, era]);
      }
    }
  } else {
    console.error(
      "Usage: fetch-bbr-decade-pools.mjs --club Lakers --era 2010s | --all [--missing] [--resume] [--delay ms]",
    );
    process.exit(1);
  }

  const errors = [];
  const summary = [];

  for (const [club, era] of jobs) {
    const min = requiredPoolMin(club, era);
    if (min === 0) {
      console.log(`skip ${club}/${era} (franchise not in era)`);
      continue;
    }

    const existing = existsSync(poolPath(club, era))
      ? JSON.parse(readFileSync(poolPath(club, era), "utf8"))
      : null;
    if (args.resume && existing?.players?.length >= min) {
      console.log(`skip ${club}/${era} (cached ${existing.players.length})`);
      summary.push({ club, era, n: existing.players.length, min, ok: true });
      continue;
    }

    process.stdout.write(`fetch ${club}/${era}… `);
    try {
      const out = await writePool(club, era, args.delay, args.cacheOnly);
      const n = out.players?.length ?? 0;
      const ok = n >= min;
      summary.push({ club, era, n, min, ok });
      console.log(`${n} players${ok ? "" : ` (need ${min})`}`);
      if (!ok && n > 0) errors.push(`${club}/${era}=${n} (need ${min})`);
      if (out.skipped) console.log(`  skipped: ${out.reason}`);
    } catch (e) {
      console.log("FAIL");
      errors.push(`${club}/${era}: ${e.message}`);
    }
  }

  console.log("\n--- summary ---");
  const sizes = summary.map((s) => s.n).filter((n) => n > 0);
  if (sizes.length) {
    console.log(
      `pools: ${sizes.length}, min=${Math.min(...sizes)}, max=${Math.max(...sizes)}, avg=${(sizes.reduce((a, b) => a + b, 0) / sizes.length).toFixed(1)}`,
    );
  }

  if (errors.length) {
    console.error(`\n${errors.length} pool(s) below minimum:`);
    for (const e of errors.slice(0, 30)) console.error(`  ${e}`);
    if (errors.length > 30) console.error(`  … and ${errors.length - 30} more`);
    process.exit(1);
  }

  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
