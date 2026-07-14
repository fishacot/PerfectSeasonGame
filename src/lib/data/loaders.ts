import { readFileSync } from "fs";
import { join } from "path";
import type { FootballLeague, PlayerSeason } from "@/lib/types";
import { NBA_CLUBS } from "@/lib/config/leagues/basketball";
import { FOOTBALL_LEAGUES } from "@/lib/config/leagues/football";
import { getFootballEras } from "@/lib/config/leagues/football";

function loadJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

const dataDir = join(process.cwd(), "public", "data");

type DataCache = {
  basketball?: PlayerSeason[];
  hockey?: PlayerSeason[];
  football?: PlayerSeason[];
};

const cache: DataCache =
  typeof globalThis !== "undefined"
    ? ((globalThis as { __pshData?: DataCache }).__pshData ??= {})
    : {};

export function loadFootballPlayers(league: FootballLeague): PlayerSeason[] {
  const all = loadJson<PlayerSeason[]>(join(dataDir, "football", "all.json"));
  const clubs = new Set(FOOTBALL_LEAGUES[league].clubs);
  const eraList = getFootballEras(league);
  const eras = new Set<string>(eraList);
  return all.filter((p) => clubs.has(p.club) && eras.has(p.era));
}

/** Sandbox: full football pool across leagues (no era-roster gates). */
export function loadAllFootballPlayers(): PlayerSeason[] {
  if (cache.football) return cache.football;
  cache.football = loadJson<PlayerSeason[]>(join(dataDir, "football", "all.json"));
  return cache.football;
}

export function loadBasketballPlayers(): PlayerSeason[] {
  if (cache.basketball) return cache.basketball;
  cache.basketball = loadJson<PlayerSeason[]>(
    join(dataDir, "basketball", "nba.json"),
  );
  return cache.basketball;
}

export function loadHockeyPlayers(): PlayerSeason[] {
  if (cache.hockey) return cache.hockey;
  cache.hockey = loadJson<PlayerSeason[]>(join(dataDir, "hockey", "nhl.json"));
  return cache.hockey;
}

export function getFootballClubs(league: FootballLeague): string[] {
  return FOOTBALL_LEAGUES[league].clubs;
}

export function getNbaClubs(): string[] {
  return [...NBA_CLUBS];
}

export function getNhlClubs(): string[] {
  const players = loadHockeyPlayers();
  return [...new Set(players.map((p) => p.club))];
}
