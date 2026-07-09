import { NextResponse } from "next/server";
import { getDailySpins } from "@/lib/game/spin";
import { SPORTS } from "@/lib/config/sports";
import { FORMATIONS, getFormationPositions, type FormationId } from "@/lib/config/formations";
import { getFootballEras, FOOTBALL_LEAGUES } from "@/lib/config/leagues/football";
import { getErasForSport } from "@/lib/config/eras";
import {
  getFootballClubs,
  getNbaClubs,
  getNhlClubs,
  loadBasketballPlayers,
  loadFootballPlayers,
  loadHockeyPlayers,
} from "@/lib/data/loaders";
import type { FootballLeague, PlayerSeason, SportId } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sport = searchParams.get("sport") as SportId | null;
  const league = searchParams.get("league") as FootballLeague | null;
  const formation = searchParams.get("formation");

  if (!sport) {
    return NextResponse.json({ error: "sport required" }, { status: 400 });
  }

  let clubs: string[];
  let eras: readonly import("@/lib/types").Era[];
  let rosterSize: number;
  let allPlayers: PlayerSeason[];

  switch (sport) {
    case "football": {
      const lg = league ?? "epl";
      clubs = getFootballClubs(lg);
      eras = getFootballEras(lg);
      rosterSize = SPORTS.football.rosterSize;
      allPlayers = loadFootballPlayers(lg);
      break;
    }
    case "basketball":
      clubs = getNbaClubs();
      eras = getErasForSport("basketball");
      rosterSize = SPORTS.basketball.rosterSize;
      allPlayers = loadBasketballPlayers();
      break;
    case "hockey":
      clubs = getNhlClubs();
      eras = getErasForSport("hockey");
      rosterSize = SPORTS.hockey.rosterSize;
      allPlayers = loadHockeyPlayers();
      break;
    default:
      return NextResponse.json({ error: "unknown sport" }, { status: 400 });
  }

  let positions = SPORTS[sport].positions;
  if (sport === "football" && formation && formation in FORMATIONS) {
    positions = getFormationPositions(formation as FormationId);
  }

  const spins = getDailySpins(
    sport,
    league ?? sport,
    rosterSize,
    clubs,
    eras,
    allPlayers,
    positions,
  );

  return NextResponse.json({
    spins,
    sport,
    league: league ?? undefined,
    brand:
      sport === "football" && league
        ? FOOTBALL_LEAGUES[league].brand
        : SPORTS[sport].brand,
  });
}
