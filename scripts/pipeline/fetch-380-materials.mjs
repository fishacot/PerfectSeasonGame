#!/usr/bin/env node
/**
 * Download 38-0.org + 38-0.app webpack chunks needed for parity work.
 * Caches under scripts/.380-chunks/
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHUNK_DIR = join(__dirname, "..", ".380-chunks");

const SOURCES = [
  {
    name: "org",
    base: "https://www.38-0.org",
    pages: ["/draft", "/"],
    mustHave: ["computeOverall", "PLAYERS", "CLUBS"],
  },
  {
    name: "app",
    base: "https://38-0.app",
    pages: ["/game", "/", "/how-to-play", "/how-it-works"],
    mustHave: ["goals", "assists", "PREMIER_LEAGUE", "runSimulated", "expectedPoints"],
  },
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchText(url, retries = 5) {
  let last;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "perfect-season-hub/380-materials" },
        signal: AbortSignal.timeout(90_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      last = e;
      if (i < retries - 1) await sleep(1500 * (i + 1));
    }
  }
  throw last;
}

function chunkFiles(html) {
  return [
    ...new Set(
      [...html.matchAll(/\/_next\/static\/chunks\/([^"'?]+\.js)/g)].map(
        (m) => m[1],
      ),
    ),
  ];
}

function scoreChunk(js, needles) {
  return needles.filter((n) => js.includes(n)).length;
}

async function downloadSource({ name, base, pages, mustHave }) {
  mkdirSync(CHUNK_DIR, { recursive: true });
  const all = new Set();
  for (const page of pages) {
    const url = `${base}${page}`;
    console.log(`fetch ${url}`);
    try {
      const html = await fetchText(url);
      const safe = page.replace(/\//g, "_") || "_root";
      writeFileSync(join(CHUNK_DIR, `${name}${safe}.html`), html, "utf8");
      for (const c of chunkFiles(html)) all.add(c);
    } catch (e) {
      console.warn(`  page failed: ${page}`, String(e));
    }
  }

  const hits = [];
  for (const file of all) {
    const dest = join(CHUNK_DIR, `${name}__${file}`);
    let js;
    if (existsSync(dest) && readFileSync(dest, "utf8").length > 1000) {
      js = readFileSync(dest, "utf8");
      console.log("cached", file, js.length);
    } else {
      try {
        console.log("download", file);
        js = await fetchText(`${base}/_next/static/chunks/${file}`);
        writeFileSync(dest, js, "utf8");
        console.log("  saved", file, js.length);
      } catch (e) {
        console.warn("  skip", file, String(e));
        continue;
      }
    }
    const sc = scoreChunk(js, mustHave);
    if (sc > 0) hits.push({ file, size: js.length, score: sc });
  }

  hits.sort((a, b) => b.score - a.score || b.size - a.size);
  console.log(`\n=== ${name} interesting chunks ===`);
  for (const h of hits.slice(0, 12)) {
    console.log(`  score=${h.score} ${h.file} (${h.size})`);
  }
  writeFileSync(
    join(CHUNK_DIR, `${name}-INDEX.json`),
    JSON.stringify({ base, hits, downloadedAt: new Date().toISOString() }, null, 2),
    "utf8",
  );
  return hits;
}

async function main() {
  mkdirSync(CHUNK_DIR, { recursive: true });
  // Keep known org players chunk alias
  const orgPlayers = join(CHUNK_DIR, "03b78z-83yf1m.js");
  if (!existsSync(orgPlayers)) {
    console.warn("missing org players chunk 03b78z-83yf1m.js — fetch:380-players will need network");
  }
  for (const src of SOURCES) {
    try {
      await downloadSource(src);
    } catch (e) {
      console.warn(src.name, "FAILED", e);
    }
  }
  console.log("\nDone. Cache:", CHUNK_DIR);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
