import type { PlayerSeason, SimulationResult } from "@/lib/types";
import { adjustRating, adjustStat } from "@/lib/simulation/era-adjust";
import {
  applyCategoryGates,
  chemistryBonus,
  nonlinearWinCurve,
} from "@/lib/simulation/engine";
import { enrichBreakdown } from "@/lib/simulation/grade";

export function simulateHockey(lineup: PlayerSeason[]): SimulationResult {
  const maxWins = 82;
  const skaters = lineup.filter((p) => !p.positions.includes("G"));
  const goalies = lineup.filter((p) => p.positions.includes("G"));

  let attack = 0;
  for (const p of skaters) {
    const g = adjustStat("hockey", p.era, p.stats.goals ?? 0);
    const a = adjustStat("hockey", p.era, p.stats.assists ?? 0);
    attack += g * 3 + a * 2 + adjustRating("hockey", p.era, p.rating) * 0.3;
  }
  attack = Math.min(100, attack / Math.max(skaters.length, 1));

  let defense = 0;
  const dmen = lineup.filter((p) => p.positions.includes("D"));
  for (const p of dmen) {
    defense += adjustRating("hockey", p.era, p.rating);
  }
  defense = Math.min(100, (defense / Math.max(dmen.length, 1)) * 0.6);

  let goaltending = 0;
  for (const p of goalies) {
    goaltending += adjustStat("hockey", p.era, (p.stats.savePct ?? 0.9) * 100);
  }
  goaltending = Math.min(100, goaltending / Math.max(goalies.length, 1));

  const categories: Record<string, number> = {
    Attack: attack,
    Defense: defense * 0.5 + goaltending * 0.5,
    Goaltending: goaltending,
  };

  const chem = chemistryBonus(
    lineup.map((p) => p.club),
    lineup.map((p) => p.era),
  );
  const avg =
    categories.Attack * 0.35 +
    categories.Defense * 0.35 +
    categories.Goaltending * 0.3;
  const score = avg * chem;
  const rawWins = nonlinearWinCurve(score, maxWins);
  const { wins, weakest, message } = applyCategoryGates(
    rawWins,
    categories,
    maxWins,
  );

  return {
    wins,
    losses: maxWins - wins,
    draws: 0,
    maxWins,
    perfect: wins >= maxWins,
    breakdown: enrichBreakdown(
      "hockey",
      lineup,
      categories,
      chem,
      wins,
      maxWins,
      weakest,
      message,
    ),
  };
}
