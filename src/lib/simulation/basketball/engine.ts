import type { Era, PlayerSeason, BasketballPlaystyle } from "@/lib/types";
import {
  CATEGORY_WEIGHTS,
  DEFAULT_ERA,
  ERA_MULTIPLIERS,
  GATE_CAP_LOW,
  GATE_CAP_MID,
  GATE_RATIO_LOW,
  GATE_RATIO_MID,
  LINEUP_TOTALS,
  MAX_WINS,
  MAX_WINS_BEFORE_LUCK,
  MIN_WINS,
  PLAYSTYLE_RATIO_MULT,
  PRODUCTION_WEIGHTS,
  WIN_CURVE_EXPONENT,
  type BasketballStatKey,
} from "@/lib/simulation/basketball/constants";

export type BasketballCategory = Uppercase<BasketballStatKey>;

const STAT_KEYS: Record<BasketballStatKey, keyof PlayerSeason["stats"]> = {
  pts: "ppg",
  reb: "rpg",
  ast: "apg",
  stl: "spg",
  blk: "bpg",
};

const CAT_ORDER: BasketballStatKey[] = ["pts", "reb", "ast", "stl", "blk"];

export function toDisplayCategory(key: BasketballStatKey): BasketballCategory {
  return key.toUpperCase() as BasketballCategory;
}

/** 82-0 adjustedStats — multiply raw averages by era scaler. */
export function adjustedPlayerStats(
  era: Era,
  stats: PlayerSeason["stats"],
): Record<BasketballStatKey, number> {
  const mult = ERA_MULTIPLIERS[era] ?? ERA_MULTIPLIERS[DEFAULT_ERA];
  return {
    pts: (stats.ppg ?? 0) * mult.pts,
    reb: (stats.rpg ?? 0) * mult.reb,
    ast: (stats.apg ?? 0) * mult.ast,
    stl: (stats.spg ?? 0) * mult.stl,
    blk: (stats.bpg ?? 0) * mult.blk,
  };
}

export function lineupCategoryTotals(
  lineup: PlayerSeason[],
): Record<BasketballStatKey, number> {
  const totals = { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0 };
  for (const p of lineup) {
    const adj = adjustedPlayerStats(p.era, p.stats);
    for (const key of CAT_ORDER) {
      totals[key] += adj[key];
    }
  }
  return totals;
}

export function totalsToRatios(
  totals: Record<BasketballStatKey, number>,
): Record<BasketballStatKey, number> {
  const ratios = {} as Record<BasketballStatKey, number>;
  for (const key of CAT_ORDER) {
    const target = LINEUP_TOTALS[key];
    ratios[key] = target > 0 ? Math.min(1, totals[key] / target) : 0;
  }
  return ratios;
}

/** 0–100 display scores (ratio × 100). */
export function ratiosToCategoryScores(
  ratios: Record<BasketballStatKey, number>,
): Record<BasketballCategory, number> {
  const out = {} as Record<BasketballCategory, number>;
  for (const key of CAT_ORDER) {
    out[toDisplayCategory(key)] = Math.round(ratios[key] * 1000) / 10;
  }
  return out;
}

export function totalsToDisplayTotals(
  totals: Record<BasketballStatKey, number>,
): Record<BasketballCategory, number> {
  const out = {} as Record<BasketballCategory, number>;
  for (const key of CAT_ORDER) {
    out[toDisplayCategory(key)] = Math.round(totals[key] * 10) / 10;
  }
  return out;
}

export function lineupTargetsDisplay(): Record<BasketballCategory, number> {
  const out = {} as Record<BasketballCategory, number>;
  for (const key of CAT_ORDER) {
    out[toDisplayCategory(key)] = LINEUP_TOTALS[key];
  }
  return out;
}

export function weightedCombo(ratios: Record<BasketballStatKey, number>): number {
  let combo = 0;
  for (const key of CAT_ORDER) {
    combo += ratios[key] * CATEGORY_WEIGHTS[key];
  }
  return combo;
}

export function findWeakest(
  ratios: Record<BasketballStatKey, number>,
): { key: BasketballStatKey; value: number } {
  let weakest = CAT_ORDER[0]!;
  let minVal = ratios[weakest];
  for (const key of CAT_ORDER) {
    if (ratios[key] < minVal) {
      minVal = ratios[key];
      weakest = key;
    }
  }
  return { key: weakest, value: minVal };
}

export function nonlinearWinCurve(
  combo: number,
  difficulty = 1,
  maxWins = MAX_WINS,
): number {
  const clamped = Math.max(0, Math.min(1, combo));
  return Math.round(maxWins * Math.pow(clamped, WIN_CURVE_EXPONENT * difficulty));
}

export function applyCategoryGates(
  projectedWins: number,
  minRatio: number,
): number {
  let wins = projectedWins;
  if (minRatio < GATE_RATIO_LOW) {
    wins = Math.min(wins, GATE_CAP_LOW);
  } else if (minRatio < GATE_RATIO_MID) {
    wins = Math.min(wins, GATE_CAP_MID);
  }
  return Math.max(MIN_WINS, Math.min(MAX_WINS_BEFORE_LUCK, wins));
}

export type GateMessageKey =
  | "perfect"
  | "nearPerfect"
  | "strong"
  | "weakPTS"
  | "weakREB"
  | "weakAST"
  | "weakSTL"
  | "weakBLK";

export function applyPlaystyleRatios(
  ratios: Record<BasketballStatKey, number>,
  playstyle: BasketballPlaystyle = "balanced",
): Record<BasketballStatKey, number> {
  const mult = PLAYSTYLE_RATIO_MULT[playstyle];
  const out = {} as Record<BasketballStatKey, number>;
  for (const key of CAT_ORDER) {
    out[key] = Math.min(1, ratios[key] * mult[key]);
  }
  return out;
}

export function gateMessageKey(
  wins: number,
  combo: number,
  minRatio: number,
  weakest: BasketballStatKey,
): GateMessageKey {
  if (wins >= MAX_WINS) return "perfect";
  if (combo >= 0.96 && minRatio >= 0.85) return "nearPerfect";
  if (minRatio >= 0.85) return "strong";
  return `weak${weakest.toUpperCase()}` as GateMessageKey;
}

export function gateMessage(
  wins: number,
  combo: number,
  minRatio: number,
  weakest: BasketballStatKey,
): string {
  if (wins >= MAX_WINS) return "Perfect season achieved!";
  if (combo >= 0.96 && minRatio >= 0.85) {
    return "Near-perfect balance — consistency held you short";
  }
  if (minRatio >= 0.85) return "Strong overall — one category kept you from 82-0";
  const labels: Record<BasketballStatKey, string> = {
    pts: "scoring",
    reb: "rebounding",
    ast: "playmaking",
    stl: "steals",
    blk: "blocks",
  };
  return `Weak ${labels[weakest]} capped your ceiling`;
}

export function basketballProductionScore(p: PlayerSeason): number {
  const adj = adjustedPlayerStats(p.era, p.stats);
  return (
    adj.pts * PRODUCTION_WEIGHTS.pts +
    adj.reb * PRODUCTION_WEIGHTS.reb +
    adj.ast * PRODUCTION_WEIGHTS.ast +
    adj.stl * PRODUCTION_WEIGHTS.stl +
    adj.blk * PRODUCTION_WEIGHTS.blk
  );
}

/** Draft pool UI order — era-adjusted PPG desc (matches Classic PPG column within one spin). */
export function basketballPoolSortScore(p: PlayerSeason): number {
  return adjustedPlayerStats(p.era, p.stats).pts;
}

export type Simulate820Options = {
  /** ponytail: live 82-0 adds randomInt(-2,2); parity fixtures use 0 */
  jitter?: number;
  difficulty?: number;
  playstyle?: BasketballPlaystyle;
};

/** Full 82-0 simulateSeason core (deterministic by default). */
export function simulate820Core(
  lineup: PlayerSeason[],
  options: Simulate820Options = {},
): {
  wins: number;
  combo: number;
  minRatio: number;
  weakest: BasketballStatKey;
  categories: Record<BasketballCategory, number>;
  totals: Record<BasketballStatKey, number>;
} {
  const difficulty = options.difficulty ?? 1;
  const jitter = options.jitter ?? 0;
  const playstyle = options.playstyle ?? "balanced";

  const totals = lineupCategoryTotals(lineup);
  const baseRatios = totalsToRatios(totals);
  const ratios = applyPlaystyleRatios(baseRatios, playstyle);
  const combo = weightedCombo(ratios);
  const { key: weakest, value: minRatio } = findWeakest(ratios);

  let wins = applyCategoryGates(nonlinearWinCurve(combo, difficulty), minRatio);
  if (jitter !== 0) {
    wins = Math.max(MIN_WINS, Math.min(MAX_WINS, wins + jitter));
  }

  return {
    wins,
    combo,
    minRatio,
    weakest,
    categories: ratiosToCategoryScores(ratios),
    totals,
  };
}

/** ponytail: run `npx tsx src/lib/simulation/basketball/engine.ts` */
export function runBasketballEngineSelfCheck(): void {
  const wilt: PlayerSeason = {
    id: "t",
    name: "Wilt",
    club: "Warriors",
    era: "1960s",
    positions: ["C"],
    stats: { ppg: 50.4, rpg: 25.1, apg: 2.3, spg: 0.5, bpg: 0.5 },
    rating: 99,
  };
  const bron: PlayerSeason = {
    id: "t2",
    name: "LeBron",
    club: "Cavaliers",
    era: "2010s",
    positions: ["SF"],
    stats: { ppg: 27.4, rpg: 8.5, apg: 8.3, spg: 1.3, bpg: 0.6 },
    rating: 99,
  };
  console.assert(basketballProductionScore(wilt) > basketballProductionScore(bron), "Wilt > LeBron production");
  const highPpg: PlayerSeason = {
    id: "sort-h",
    name: "Scorer",
    club: "Suns",
    era: "1970s",
    positions: ["SG"],
    stats: { ppg: 24.2, rpg: 2, apg: 2, spg: 1, bpg: 0 },
    rating: 80,
  };
  const lowPpg: PlayerSeason = {
    id: "sort-l",
    name: "Role",
    club: "Suns",
    era: "1970s",
    positions: ["C"],
    stats: { ppg: 13.4, rpg: 10, apg: 5, spg: 2, bpg: 2 },
    rating: 99,
  };
  console.assert(
    basketballPoolSortScore(highPpg) > basketballPoolSortScore(lowPpg),
    "pool sort follows era-adjusted PPG not full production",
  );
  const r = simulate820Core([wilt, wilt, wilt, wilt, wilt]);
  console.assert(r.wins >= MIN_WINS && r.wins <= MAX_WINS_BEFORE_LUCK, "wins in range");
  const gated = simulate820Core([
    {
      id: "a",
      name: "A",
      club: "X",
      era: "2000s",
      positions: ["SG"],
      stats: { ppg: 31, rpg: 4, apg: 7, spg: 2.5, bpg: 0.1 },
      rating: 90,
    },
    {
      id: "b",
      name: "B",
      club: "X",
      era: "2000s",
      positions: ["SG"],
      stats: { ppg: 35, rpg: 5, apg: 4, spg: 1.8, bpg: 0.4 },
      rating: 90,
    },
    {
      id: "c",
      name: "C",
      club: "X",
      era: "2000s",
      positions: ["SG"],
      stats: { ppg: 32, rpg: 6, apg: 5, spg: 1.6, bpg: 0.8 },
      rating: 90,
    },
    {
      id: "d",
      name: "D",
      club: "X",
      era: "2000s",
      positions: ["SG"],
      stats: { ppg: 27, rpg: 5, apg: 4, spg: 1.5, bpg: 0.6 },
      rating: 90,
    },
    {
      id: "e",
      name: "E",
      club: "X",
      era: "2000s",
      positions: ["SG"],
      stats: { ppg: 25, rpg: 4, apg: 3, spg: 1.2, bpg: 0.2 },
      rating: 90,
    },
  ]);
  console.assert(gated.wins <= GATE_CAP_MID, "scorer-heavy gate");
}

if (typeof require !== "undefined" && require.main === module) {
  runBasketballEngineSelfCheck();
  console.log("basketball engine self-check ok");
}
