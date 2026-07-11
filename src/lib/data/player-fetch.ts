import { NBA_CLUBS } from "@/lib/config/leagues/basketball";
import { FOOTBALL_LEAGUES, getFootballEras } from "@/lib/config/leagues/football";
import type { FootballLeague, PlayerSeason, SportId } from "@/lib/types";

type PlayerPayload = {
  players: PlayerSeason[];
  clubs: string[];
};

const cache = new Map<string, Promise<PlayerPayload>>();

function cacheKey(sport: SportId, league?: FootballLeague, all?: boolean): string {
  return `${sport}:${league ?? ""}:${all ? "all" : ""}`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.json() as Promise<T>;
}

async function fetchBasketballPlayers(): Promise<PlayerPayload> {
  const players = await fetchJson<PlayerSeason[]>("/data/basketball/nba.json");
  return { players, clubs: [...NBA_CLUBS] };
}

async function fetchHockeyPlayers(): Promise<PlayerPayload> {
  const players = await fetchJson<PlayerSeason[]>("/data/hockey/nhl.json");
  const clubs = [...new Set(players.map((p) => p.club))].sort();
  return { players, clubs };
}

async function fetchFootballPlayers(
  league?: FootballLeague,
  all = false,
): Promise<PlayerPayload> {
  const players = await fetchJson<PlayerSeason[]>("/data/football/all.json");
  if (all || !league) {
    const clubs = [...new Set(players.map((p) => p.club))].sort();
    return { players, clubs };
  }
  const clubs = [...FOOTBALL_LEAGUES[league].clubs];
  const clubSet = new Set(clubs);
  const eras = new Set<string>(getFootballEras(league));
  return {
    players: players.filter((p) => clubSet.has(p.club) && eras.has(p.era)),
    clubs,
  };
}

/** Client-side player pool — static JSON in public/ (works in APK + web). */
export function prefetchPlayers(
  sport: SportId,
  league?: FootballLeague,
  all = false,
): Promise<PlayerPayload> {
  const key = cacheKey(sport, league, all);
  let pending = cache.get(key);
  if (!pending) {
    switch (sport) {
      case "basketball":
        pending = fetchBasketballPlayers();
        break;
      case "hockey":
        pending = fetchHockeyPlayers();
        break;
      case "football":
        pending = fetchFootballPlayers(league, all);
        break;
      default: {
        const _exhaustive: never = sport;
        throw new Error(`unknown sport: ${_exhaustive}`);
      }
    }
    cache.set(key, pending);
  }
  return pending;
}
