#!/usr/bin/env node
/**
 * Applies scripts/bbr-reference/*.json stats onto merged NBA pool at generate time.
 * Source seeds stay readable; reference is canonical for verified players.
 */
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadBbrReference() {
  const dir = join(__dirname, "bbr-reference");
  const entries = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const raw = JSON.parse(readFileSync(join(dir, file), "utf8"));
    if (Array.isArray(raw)) entries.push(...raw);
    else if (raw.entries) entries.push(...raw.entries);
  }
  return entries;
}

/** @param {Record<string, Partial<Record<string, object[]>>>} pool */
export function applyBbrReference(pool) {
  const reference = loadBbrReference();
  let applied = 0;
  for (const ref of reference) {
    const bucket = pool[ref.club]?.[ref.era];
    if (!bucket) continue;
    const seed = bucket.find((s) => s.name === ref.name);
    if (!seed) continue;
    seed.stats = {
      ppg: ref.ppg,
      rpg: ref.rpg,
      apg: ref.apg,
      spg: ref.spg,
      bpg: ref.bpg,
    };
    applied++;
  }
  return applied;
}
