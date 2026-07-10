import type { FootballLeague, PlayerSeason, SportId } from "@/lib/types";

type PlayerPayload = {
  players: PlayerSeason[];
  clubs: string[];
};

const cache = new Map<string, Promise<PlayerPayload>>();

function cacheKey(sport: SportId, league?: FootballLeague, all?: boolean): string {
  return `${sport}:${league ?? ""}:${all ? "all" : ""}`;
}

/** Client-side player pool fetch — shared by SportPlay/SportSandbox prefetch and game clients. */
export function prefetchPlayers(
  sport: SportId,
  league?: FootballLeague,
  all = false,
): Promise<PlayerPayload> {
  const key = cacheKey(sport, league, all);
  let pending = cache.get(key);
  if (!pending) {
    const q = [
      `sport=${sport}`,
      league ? `league=${league}` : "",
      all ? "all=1" : "",
    ]
      .filter(Boolean)
      .join("&");
    pending = fetch(`/api/players?${q}`).then((res) => {
      if (!res.ok) throw new Error(`players ${res.status}`);
      return res.json() as Promise<PlayerPayload>;
    });
    cache.set(key, pending);
  }
  return pending;
}
