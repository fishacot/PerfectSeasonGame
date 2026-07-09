#!/usr/bin/env node
/**
 * Filter org all.json by the 3 popular leagues (EPL / La Liga / Serie A).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const ALL_JSON = join(ROOT, "data", "football", "all.json");
const OUT_DIR = join(ROOT, "data", "football", "leagues");

/** Mirrors src/lib/config/leagues/football.ts — 3 leagues only. */
const LEAGUES = {
  epl: {
    name: "Premier League",
    seasonGames: 38,
    clubs: [
      "Arsenal",
      "Chelsea",
      "Liverpool",
      "Manchester City",
      "Manchester United",
      "Tottenham",
    ],
  },
  laliga: {
    name: "La Liga",
    seasonGames: 38,
    clubs: ["Barcelona", "Real Madrid", "Atletico Madrid", "Sevilla"],
  },
  seriea: {
    name: "Serie A",
    seasonGames: 38,
    clubs: ["AC Milan", "Inter Milan", "Juventus", "Napoli"],
  },
};

const ORG_ERAS = ["2000s", "2010s", "2020s"];

function poolStats(players) {
  const pools = new Map();
  const byClub = {};
  const byEra = {};
  for (const p of players) {
    const k = `${p.club}|${p.era}`;
    pools.set(k, (pools.get(k) ?? 0) + 1);
    byClub[p.club] = (byClub[p.club] ?? 0) + 1;
    byEra[p.era] = (byEra[p.era] ?? 0) + 1;
  }
  const sizes = [...pools.values()];
  return {
    players: players.length,
    pools: pools.size,
    poolSizeMin: sizes.length ? Math.min(...sizes) : 0,
    poolSizeMax: sizes.length ? Math.max(...sizes) : 0,
    byClub,
    byEra,
  };
}

function main() {
  if (!existsSync(ALL_JSON)) {
    console.error("Missing", ALL_JSON, "— run: npm run fetch:380-players");
    process.exit(1);
  }
  const all = JSON.parse(readFileSync(ALL_JSON, "utf8"));
  mkdirSync(OUT_DIR, { recursive: true });

  const summary = {
    generatedAt: new Date().toISOString(),
    source: "38-0.org via all.json",
    model: "3 leagues (epl, laliga, seriea)",
    eras: ORG_ERAS,
    leagues: {},
  };

  for (const [id, cfg] of Object.entries(LEAGUES)) {
    const clubSet = new Set(cfg.clubs);
    const players = all.filter(
      (p) => clubSet.has(p.club) && ORG_ERAS.includes(p.era),
    );
    const stats = poolStats(players);
    const missingClubs = cfg.clubs.filter((c) => !stats.byClub[c]);
    const meta = {
      id,
      name: cfg.name,
      seasonGames: cfg.seasonGames,
      clubs: cfg.clubs,
      missingClubs,
      eras: ORG_ERAS,
      ...stats,
    };
    writeFileSync(join(OUT_DIR, `${id}.json`), JSON.stringify(players, null, 2));
    writeFileSync(join(OUT_DIR, `${id}-meta.json`), JSON.stringify(meta, null, 2));
    summary.leagues[id] = meta;
    console.log(
      `${id}: ${stats.players} players, ${stats.pools} pools, missing clubs: ${missingClubs.join(", ") || "none"}`,
    );
  }

  writeFileSync(join(OUT_DIR, "_summary.json"), JSON.stringify(summary, null, 2));
  writeFileSync(
    join(OUT_DIR, "manifest.json"),
    JSON.stringify(
      {
        leagues: Object.keys(LEAGUES),
        eras: ORG_ERAS,
        note: "Bundesliga/Ligue1 removed — 3 popular leagues only",
      },
      null,
      2,
    ),
  );
  console.log("\nWrote", OUT_DIR);
}

main();
