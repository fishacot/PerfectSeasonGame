#!/usr/bin/env node
/** ponytail: one-shot probe — find where 82-0 embeds NBA player data */
const BASE = "https://www.82-0-challenge.com";

const html = await (await fetch(`${BASE}/en/team-builder`)).text();
const chunks = [
  ...new Set([...html.matchAll(/\/_next\/static\/chunks\/([^"']+\.js)/g)].map((m) => m[1])),
];
console.log("team-builder chunks:", chunks.length);

let webpack = "";
try {
  webpack = await (await fetch(`${BASE}/_next/static/chunks/webpack-6425410be9a39d53.js`)).text();
} catch {
  const w = chunks.find((c) => c.startsWith("webpack-"));
  if (w) webpack = await (await fetch(`${BASE}/_next/static/chunks/${w}`)).text();
}

for (const id of ["7977", "4496", "9814", "3"]) {
  const m = webpack.match(new RegExp(`${id}:"([a-f0-9]{16})"`));
  if (m) console.log(`module ${id} -> ${m[1]}.js chunk file: ${id}-${m[1]}.js`);
}

// Try common data URLs
const tries = [
  "/data/nba.json",
  "/nba.json",
  "/api/nba/players",
  "/api/players",
  "/_next/data/build/en/team-builder.json",
];
for (const path of tries) {
  const res = await fetch(`${BASE}${path}`);
  console.log(path, res.status, res.headers.get("content-type"));
}

// Scan cached + downloaded chunks for player-like JSON
const candidates = chunks.filter((c) => /^\d+-/.test(c)).slice(0, 40);
for (const c of candidates) {
  const js = await (await fetch(`${BASE}/_next/static/chunks/${c}`)).text();
  if (js.includes("ppg") && (js.includes("Lakers") || js.includes("Celtics"))) {
    console.log("PLAYER DATA CANDIDATE:", c, "size", js.length);
  }
}
