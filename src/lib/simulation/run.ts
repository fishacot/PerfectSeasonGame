import type { BasketballPlaystyle } from "@/lib/types";
import { simulateFootball } from "@/lib/simulation/adapters/football";
import { simulateBasketball } from "@/lib/simulation/adapters/basketball";
import { simulateHockey } from "@/lib/simulation/adapters/hockey";
import type { PlayerSeason, SimulationResult, SportId } from "@/lib/types";
import { FOOTBALL_LEAGUES } from "@/lib/config/leagues/football";
import type { FootballLeague } from "@/lib/types";

export function runSimulation(
  sport: SportId,
  lineup: PlayerSeason[],
  league?: FootballLeague,
  playstyle?: BasketballPlaystyle,
  slotLabels?: string[],
): SimulationResult {
  switch (sport) {
    case "football": {
      const maxWins = league
        ? FOOTBALL_LEAGUES[league].seasonGames
        : 38;
      return simulateFootball(lineup, maxWins, slotLabels);
    }
    case "basketball":
      return simulateBasketball(lineup, { playstyle });
    case "hockey":
      return simulateHockey(lineup);
    default: {
      const _exhaustive: never = sport;
      return _exhaustive;
    }
  }
}
