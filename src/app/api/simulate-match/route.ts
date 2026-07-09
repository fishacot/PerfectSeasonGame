import { NextResponse } from "next/server";
import { simulateBasketballMatch } from "@/lib/simulation/match/basketball-match";
import { simulateFootballMatch } from "@/lib/simulation/match/football-match";
import type { PlayerSeason, SportId } from "@/lib/types";

/**
 * Sandbox head-to-head match — no season era-roster gates.
 * Body: { sport, home, away, homeSlots?, awaySlots?, homeLabel?, awayLabel?, seed? }
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sport: SportId;
      home: PlayerSeason[];
      away: PlayerSeason[];
      homeSlots?: string[];
      awaySlots?: string[];
      homeLabel?: string;
      awayLabel?: string;
      seed?: number;
    };

    if (!body.sport || !body.home?.length || !body.away?.length) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (body.sport === "basketball") {
      if (body.home.length !== 5 || body.away.length !== 5) {
        return NextResponse.json({ error: "Need 5v5" }, { status: 400 });
      }
      const result = simulateBasketballMatch(body.home, body.away, {
        homeSlots: body.homeSlots,
        awaySlots: body.awaySlots,
        homeLabel: body.homeLabel,
        awayLabel: body.awayLabel,
        seed: body.seed,
      });
      return NextResponse.json(result);
    }

    if (body.sport === "football") {
      if (body.home.length !== 11 || body.away.length !== 11) {
        return NextResponse.json({ error: "Need 11v11" }, { status: 400 });
      }
      const result = simulateFootballMatch(body.home, body.away, {
        homeSlots: body.homeSlots,
        awaySlots: body.awaySlots,
        homeLabel: body.homeLabel,
        awayLabel: body.awayLabel,
        seed: body.seed,
      });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Sport not supported" }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Simulation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
