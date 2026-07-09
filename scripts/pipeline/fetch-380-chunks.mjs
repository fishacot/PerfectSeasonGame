#!/usr/bin/env node
/** Download 38-0 webpack chunks and scan for embedded player DB. */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHUNK_DIR = join(__dirname, ".380-chunks");

const SOURCES = [
  {
    name: "38-0.org",
    base: "https://www.38-0.org",
    pages: ["/draft", "/"],
  },
  {
    name: "38-0.app",
    base: "https://38-0.app",
    pages: ["/game", "/"],
  },
];

async function fetchText(url, retries = 4) {
  let last;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "perfect-season-hub/380-fetch" },
        signal: AbortSignal.timeout(60_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      last = e;
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw last;
}

function chunkUrls(html) {
  return [
    ...new Set(
      [...html.matchAll(/\/_next\/static\/chunks\/([^"'?]+\.js)/g)].map(
        (m) => m[1],
      ),
    ),
  ];
}

async function downloadSource({ name, base, pages }) {
  const all = new Set();
  for (const page of pages) {
    console.log(`fetch ${base}${page}`);
    const html = await fetchText(`${base}${page}`);
    const outHtml = join(CHUNK_DIR, `${name.replace(/\W/g, "_")}${page.replace(/\//g, "_") || "_root"}.html`);
    writeFileSync(outHtml, html, "utf8");
    for (const c of chunkUrls(html)) all.add(c);
  }
  mkdirSync(CHUNK_DIR, { recursive: true });
  for (const file of all) {
    const dest = join(CHUNK_DIR, file);
    if (existsSync(dest) && readFileSync(dest, "utf8").length > 500) {
      console.log("cached", file);
      continue;
    }
    const url = `${base}/_next/static/chunks/${file}`;
    console.log("download", url);
    const js = await fetchText(url);
    writeFileSync(dest, js, "utf8");
    console.log("  ", file, js.length);
  }
}

function scanChunks() {
  const needles = [
    "JSON.parse('",
    "Chiesa",
    "Thierry",
    "goals",
    "assists",
    "decade",
    "OVR",
    "ovr",
    "cleanSheet",
    "playerPool",
    "let m=[",
  ];
  for (const file of readdirSync(CHUNK_DIR).filter((f) => f.endsWith(".js"))) {
    const s = readFileSync(join(CHUNK_DIR, file), "utf8");
    const hits = needles.filter((n) => s.includes(n));
    if (hits.length >= 2) {
      console.log("\n===", file, s.length, "===");
      console.log("hits:", hits.join(", "));
      for (const n of ["JSON.parse('", "Chiesa", "goals", "decade", "OVR"]) {
        if (!s.includes(n)) continue;
        const i = s.indexOf(n);
        console.log(n, "->", s.slice(i, i + 250));
      }
    }
  }
}

async function main() {
  mkdirSync(CHUNK_DIR, { recursive: true });
  for (const src of SOURCES) {
    try {
      await downloadSource(src);
    } catch (e) {
      console.warn(src.name, "failed:", e);
    }
  }
  scanChunks();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
