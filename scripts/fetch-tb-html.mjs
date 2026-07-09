#!/usr/bin/env node
/** Fetch team-builder HTML and find all chunk filenames */
const BASE = "https://www.82-0-challenge.com";

async function fetchText(url, tries = 5) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html,*/*" },
        signal: AbortSignal.timeout(60000),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return await res.text();
    } catch (e) {
      console.error(`try ${i + 1}/${tries} ${url}:`, e.message);
      await new Promise((r) => setTimeout(r, 3000 * (i + 1)));
    }
  }
  throw new Error(`failed ${url}`);
}

const html = await fetchText(`${BASE}/en/team-builder`);
const chunks = [...new Set([...html.matchAll(/\/_next\/static\/chunks\/([^"']+\.js)/g)].map((m) => m[1]))];
console.log("chunks:", chunks.length);
for (const c of chunks.sort()) console.log(c);

const rsc = [...html.matchAll(/static\/chunks\/(\d+-[a-f0-9]+\.js)/g)].map((m) => m[1]);
console.log("\nnumeric chunks:", [...new Set(rsc)].join(", "));
