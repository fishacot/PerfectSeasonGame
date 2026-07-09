import { NextResponse } from "next/server";
import { getFootballEras } from "@/lib/config/leagues/football";
import { isRosterEraValid } from "@/lib/game/validation";
import { runSimulation } from "@/lib/simulation/run";
import type { BasketballPlaystyle, FootballLeague, PlayerSeason, SportId } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sport: SportId;
      league?: FootballLeague;
      lineup: PlayerSeason[];
      playstyle?: BasketballPlaystyle;
      slotLabels?: string[];
      /** Sandbox free-build: skip season era roster gates */
      sandbox?: boolean;
    };
    if (!body.sport || !body.lineup?.length) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!body.sandbox) {
      const eras = body.lineup.map((p) => p.era);
      const requiredEras =
        body.sport === "football" && body.league
          ? getFootballEras(body.league)
          : body.sport === "football"
            ? getFootballEras("epl")
            : stateErasPlaceholder(body.sport);
      if (!isRosterEraValid(body.sport, eras, requiredEras)) {
        return NextResponse.json({ error: "Invalid era rules" }, { status: 400 });
      }
    }

    const result = runSimulation(
      body.sport,
      body.lineup,
      body.league,
      body.playstyle,
      body.slotLabels,
    );
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Simulation failed" }, { status: 500 });
  }
}

/** ponytail: basketball/hockey ignore requiredEraList; empty list is fine */
function stateErasPlaceholder(_sport: SportId): readonly never[] {
  return [];
}
