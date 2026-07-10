import { NextResponse } from "next/server";
import {
  getFootballClubs,
  getNbaClubs,
  getNhlClubs,
  loadAllFootballPlayers,
  loadBasketballPlayers,
  loadFootballPlayers,
  loadHockeyPlayers,
} from "@/lib/data/loaders";
import type { FootballLeague, SportId } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sport = searchParams.get("sport") as SportId | null;
  const league = searchParams.get("league") as FootballLeague | null;
  const allFootball = searchParams.get("all") === "1";

  if (!sport) {
    return NextResponse.json({ error: "sport required" }, { status: 400 });
  }

  let players;
  let clubs: string[];

  switch (sport) {
    case "football": {
      if (allFootball) {
        players = loadAllFootballPlayers();
        clubs = [...new Set(players.map((p) => p.club))];
      } else {
        const lg = league ?? "epl";
        players = loadFootballPlayers(lg);
        clubs = getFootballClubs(lg);
      }
      break;
    }
    case "basketball":
      players = loadBasketballPlayers();
      clubs = getNbaClubs();
      break;
    case "hockey":
      players = loadHockeyPlayers();
      clubs = getNhlClubs();
      break;
    default:
      return NextResponse.json({ error: "unknown sport" }, { status: 400 });
  }

  return NextResponse.json(
    { players, clubs, sport, league: league ?? undefined },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    },
  );
}
