import type { PlayerSeason, SimulationResult } from "@/lib/types";
import { adjustRating } from "@/lib/simulation/era-adjust";
import {
  applyCategoryGates,
  chemistryBonus,
  nonlinearWinCurve,
} from "@/lib/simulation/engine";
import { canPlaceAtPosition } from "@/lib/game/validation";
import { enrichBreakdown } from "@/lib/simulation/grade";

function lineRating(players: PlayerSeason[], weight = 1): number {
  if (players.length === 0) return 0;
  const sum = players.reduce(
    (a, p) => a + adjustRating("football", p.era, p.rating),
    0,
  );
  return (sum / players.length) * weight;
}

/** ponytail: 38-0 balance heuristic; upgrade via extract-380-sim.mjs */
function lineBalance(categories: Record<string, number>): number {
  const vals = Object.values(categories);
  if (vals.length === 0) return 1;
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  const min = Math.min(...vals);
  if (avg <= 0) return 0;
  return Math.pow(min / avg, 1.4);
}

export function simulateFootball(
  lineup: PlayerSeason[],
  maxWins = 38,
  slotLabels?: string[],
): SimulationResult {
  const gk = lineup.filter((p) => p.positions.includes("GK"));
  const def = lineup.filter((p) =>
    p.positions.some((pos) => ["LB", "CB", "RB", "DF"].includes(pos)),
  );
  const mid = lineup.filter((p) =>
    p.positions.some((pos) =>
      ["CM", "MF", "DM", "AM", "LM", "RM"].includes(pos),
    ),
  );
  const att = lineup.filter((p) =>
    p.positions.some((pos) =>
      ["LW", "RW", "ST", "FW", "LM", "RM"].includes(pos),
    ),
  );

  const categories: Record<string, number> = {
    GK: lineRating(gk, 1.2),
    DEF: lineRating(def),
    MID: lineRating(mid),
    ATT: lineRating(att, 1.1),
  };

  const chem = chemistryBonus(
    lineup.map((p) => p.club),
    lineup.map((p) => p.era),
  );
  let positionChem = 1;
  if (slotLabels && slotLabels.length === lineup.length) {
    let misfits = 0;
    lineup.forEach((p, i) => {
      const slot = slotLabels[i];
      if (slot && !canPlaceAtPosition(p.positions, slot)) misfits++;
    });
    positionChem = Math.max(0.88, 1 - misfits * 0.03);
  }
  const avg =
    (categories.GK! + categories.DEF! + categories.MID! + categories.ATT!) / 4;
  const balance = lineBalance(categories);
  const score = avg * chem * positionChem * balance;
  const rawWins = nonlinearWinCurve(score, maxWins);
  const { wins, weakest, message } = applyCategoryGates(
    rawWins,
    categories,
    maxWins,
  );

  const losses = Math.max(0, maxWins - wins);
  const draws = Math.min(
    maxWins - wins,
    Math.max(0, Math.round((maxWins - wins) * 0.12)),
  );
  const adjustedLosses = Math.max(0, losses - draws);
  return {
    wins,
    losses: adjustedLosses,
    draws,
    maxWins,
    perfect: wins >= maxWins,
    breakdown: enrichBreakdown(
      "football",
      lineup,
      categories,
      chem * positionChem * balance,
      wins,
      maxWins,
      weakest,
      message,
    ),
  };
}
