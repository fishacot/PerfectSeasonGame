import { basketballProductionScore } from "@/lib/simulation/basketball/engine";
import { adjustRating } from "@/lib/simulation/era-adjust";
import type { PlayerSeason, SimulationBreakdown, SportId } from "@/lib/types";

export type LetterGrade =
  | "A+"
  | "A"
  | "A-"
  | "B+"
  | "B"
  | "B-"
  | "C+"
  | "C"
  | "C-"
  | "D"
  | "F";

export type ResultTier =
  | "perfect"
  | "invincibles"
  | "goat"
  | "elite"
  | "contender"
  | null;

/** 82-0 Team Builder grade from weighted combo (k = 100 × m). */
export function basketballComboToGrade(combo: number): string {
  const k = combo * 100;
  if (k >= 97) return "S+";
  if (k >= 94) return "S";
  if (k >= 88) return "A";
  if (k >= 78) return "B";
  if (k >= 65) return "C";
  return "D";
}

/** Map win share → letter grade (football/hockey result screen). */
export function winsToGrade(wins: number, maxWins: number): LetterGrade {
  const pct = maxWins > 0 ? wins / maxWins : 0;
  if (pct >= 0.95) return "A+";
  if (pct >= 0.85) return "A";
  if (pct >= 0.78) return "A-";
  if (pct >= 0.7) return "B+";
  if (pct >= 0.62) return "B";
  if (pct >= 0.55) return "B-";
  if (pct >= 0.48) return "C+";
  if (pct >= 0.4) return "C";
  if (pct >= 0.33) return "C-";
  if (pct >= 0.25) return "D";
  return "F";
}

/** Map 0–100 avg category score → letter grade (football/hockey breakdown). */
export function scoreToGrade(avgScore: number): LetterGrade {
  if (avgScore >= 92) return "A+";
  if (avgScore >= 88) return "A";
  if (avgScore >= 84) return "A-";
  if (avgScore >= 80) return "B+";
  if (avgScore >= 76) return "B";
  if (avgScore >= 72) return "B-";
  if (avgScore >= 68) return "C+";
  if (avgScore >= 64) return "C";
  if (avgScore >= 60) return "C-";
  if (avgScore >= 55) return "D";
  return "F";
}

export function winsToTier(wins: number, maxWins: number): ResultTier {
  if (wins >= maxWins) {
    return maxWins === 38 ? "invincibles" : "perfect";
  }
  if (wins >= maxWins * 0.95) return "goat";
  if (wins >= maxWins * 0.85) return "elite";
  if (wins >= maxWins * 0.7) return "contender";
  return null;
}

function basketballPickScore(p: PlayerSeason): number {
  return basketballProductionScore(p);
}

export function pickBestPlayer(
  sport: SportId,
  lineup: PlayerSeason[],
): { id: string; name: string } | null {
  if (lineup.length === 0) return null;
  let best = lineup[0]!;
  let bestScore =
    sport === "basketball"
      ? basketballPickScore(best)
      : adjustRating(sport, best.era, best.rating);
  for (let i = 1; i < lineup.length; i++) {
    const p = lineup[i]!;
    const score =
      sport === "basketball"
        ? basketballPickScore(p)
        : adjustRating(sport, p.era, p.rating);
    if (score > bestScore) {
      best = p;
      bestScore = score;
    }
  }
  return { id: best.id, name: best.name };
}

export function enrichBreakdown(
  sport: SportId,
  lineup: PlayerSeason[],
  categories: Record<string, number>,
  chemistry: number,
  wins: number,
  maxWins: number,
  weakest: string,
  gateMessage: string,
  basketballCombo?: number,
): SimulationBreakdown {
  const avg =
    Object.values(categories).reduce((a, b) => a + b, 0) /
    Object.keys(categories).length;
  const best = pickBestPlayer(sport, lineup);
  return {
    categories,
    chemistry,
    gateMessage,
    weakestCategory: weakest,
    grade:
      sport === "basketball"
        ? basketballComboToGrade(basketballCombo ?? wins / maxWins)
        : scoreToGrade(avg),
    tier: winsToTier(wins, maxWins),
    bestPickId: best?.id ?? null,
    bestPickName: best?.name ?? null,
  };
}

// ponytail: run with `npx tsx src/lib/simulation/grade.ts`
if (typeof require !== "undefined" && require.main === module) {
  console.assert(basketballComboToGrade(0.97) === "S+", "S+ threshold");
  console.assert(basketballComboToGrade(0.88) === "A", "A threshold");
  console.assert(scoreToGrade(95) === "A+", "A+ threshold");
  console.assert(scoreToGrade(50) === "F", "F threshold");
  console.assert(winsToTier(38, 38) === "invincibles", "football perfect");
  console.assert(winsToTier(82, 82) === "perfect", "nba perfect");
  console.log("grade self-check ok");
}
