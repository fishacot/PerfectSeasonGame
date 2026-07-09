#!/usr/bin/env node
/**
 * Extract 82-0 simulation constants from webpack module 7977 (9696 chunk).
 * Output: data/raw/basketball/820-sim-snapshot.json
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
const ROOT = join(__dirname, "..", "..");
const CHUNK_CACHE = join(__dirname, "..", ".820-chunks");
const OUT = join(ROOT, "data", "raw", "basketball", "820-sim-snapshot.json");
const BASE = "https://www.82-0-challenge.com";

function extractModule7977(chunkJs) {
  const start = chunkJs.indexOf("7977:function");
  if (start < 0) throw new Error("7977:function missing");
  const end = chunkJs.indexOf("4496:function", start);
  if (end < 0) throw new Error("4496:function boundary missing");
  return chunkJs.slice(start, end);
}

function parseEraMultipliers(mod) {
  const start = mod.indexOf('_"1960s"') > 0 ? mod.indexOf('={"1960s"') : mod.indexOf('={"1960s"');
  const anchor = mod.indexOf('={"1960s"');
  if (anchor < 0) return null;
  const end = mod.indexOf("},S={", anchor);
  if (end < 0) return null;
  const raw = mod.slice(anchor + 1, end + 1);
  return Function(`"use strict";return (${raw})`)();
}

function parseLineupTotals(mod) {
  const m = mod.match(/S=\{pts:(\d+),reb:(\d+),ast:(\d+),stl:([\d.]+),blk:([\d.]+)\}/);
  if (!m) return null;
  return {
    pts: +m[1],
    reb: +m[2],
    ast: +m[3],
    stl: +m[4],
    blk: +m[5],
  };
}

function parseCategoryWeights(mod) {
  const m = mod.match(
    /\.3\*d\.pts\+\.2\*d\.reb\+\.2\*d\.ast\+\.15\*d\.stl\+\.15\*d\.blk/,
  );
  return m
    ? { pts: 0.3, reb: 0.2, ast: 0.2, stl: 0.15, blk: 0.15 }
    : null;
}

function parseWinCurve(mod) {
  const m = mod.match(/Math\.pow\(m,([\d.]+)\*n\)/);
  return m ? +m[1] : null;
}

function parseGates(mod) {
  const m = mod.match(/c<\.(\d+)\?h=Math\.min\(h,(\d+)\):c<\.(\d+)/);
  if (!m) return null;
  return {
    lowRatio: +`0.${m[1]}`,
    lowCap: +m[2],
    midRatio: +`0.${m[3]}`,
    midCap: null,
  };
}

function parseMidCap(mod) {
  const m = mod.match(/c<\.75&&\(h=Math\.min\(h,(\d+)\)\)/);
  return m ? +m[1] : 76;
}

function parseGradeThresholds(mod) {
  const m = mod.match(
    /k>=97\?"S\+":k>=94\?"S":k>=88\?"A":k>=78\?"B":k>=65\?"C":"D"/,
  );
  return m
    ? { S_plus: 97, S: 94, A: 88, B: 78, C: 65 }
    : null;
}

async function ensureChunk() {
  mkdirSync(CHUNK_CACHE, { recursive: true });
  const cached = join(CHUNK_CACHE, "9696-6c54a9d9869e047c.js");
  if (existsSync(cached)) return readFileSync(cached, "utf8");

  const home = await fetch(BASE, {
    headers: { "User-Agent": "perfect-season-hub/820-extract" },
  }).then((r) => r.text());
  const chunkMatch = home.match(/\/_next\/static\/chunks\/9696-[^"']+\.js/);
  if (!chunkMatch) throw new Error("9696 chunk not found");
  const js = await fetch(BASE + chunkMatch[0], {
    headers: { "User-Agent": "perfect-season-hub/820-extract" },
  }).then((r) => r.text());
  writeFileSync(cached, js, "utf8");
  return js;
}

async function main() {
  const chunkJs = await ensureChunk();
  const mod = extractModule7977(chunkJs);
  const gates = parseGates(mod);
  if (gates) gates.midCap = parseMidCap(mod);

  const snapshot = {
    extractedAt: new Date().toISOString(),
    source: `${BASE} webpack module 7977`,
    eraMultipliers: parseEraMultipliers(mod),
    lineupTotals: parseLineupTotals(mod),
    categoryWeights: parseCategoryWeights(mod),
    winCurveExponent: parseWinCurve(mod),
    gates,
    gradeThresholds: parseGradeThresholds(mod),
    simulateSeasonSnippet: mod.slice(
      mod.indexOf("function simulateSeason"),
      mod.indexOf("function simulateSeason") + 1200,
    ),
    productionScoreFormula: "pts + 1.1*reb + 1.4*ast + 4*stl + 4*blk (era-adjusted)",
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(snapshot, null, 2), "utf8");
  console.log(`Wrote ${OUT}`);
  console.log(JSON.stringify(snapshot, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
