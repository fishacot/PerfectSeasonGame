import type { PlayerSeason, SimulationResult, BasketballPlaystyle } from "@/lib/types";
import {
  basketballProductionScore,
  gateMessage,
  gateMessageKey,
  lineupTargetsDisplay,
  simulate820Core,
  toDisplayCategory,
  totalsToDisplayTotals,
} from "@/lib/simulation/basketball/engine";
import { MAX_WINS } from "@/lib/simulation/basketball/constants";
import { basketballComboToGrade, enrichBreakdown } from "@/lib/simulation/grade";

/** 82-0 live luck: randomInt(-2, 2). Parity fixtures use jitter=0. */
export function liveSimJitter(): number {
  return Math.floor(Math.random() * 5) - 2;
}

export function simulateBasketball(
  lineup: PlayerSeason[],
  options?: { jitter?: number; playstyle?: BasketballPlaystyle },
): SimulationResult {
  const maxWins = MAX_WINS;
  const jitter = options?.jitter ?? liveSimJitter();
  const playstyle = options?.playstyle ?? "balanced";
  const core = simulate820Core(lineup, { jitter, playstyle });
  const gKey = gateMessageKey(
    core.wins,
    core.combo,
    core.minRatio,
    core.weakest,
  );
  const message = gateMessage(
    core.wins,
    core.combo,
    core.minRatio,
    core.weakest,
  );

  return {
    wins: core.wins,
    losses: maxWins - core.wins,
    draws: 0,
    maxWins,
    perfect: core.wins >= maxWins,
    breakdown: {
      ...enrichBreakdown(
        "basketball",
        lineup,
        core.categories,
        1,
        core.wins,
        maxWins,
        toDisplayCategory(core.weakest),
        message,
        core.combo,
      ),
      categoryTotals: totalsToDisplayTotals(core.totals),
      categoryTargets: lineupTargetsDisplay(),
      combo: Math.round(core.combo * 1000) / 10,
      gateKey: gKey,
    },
  };
}

export { basketballProductionScore };
