import type { Era } from "@/lib/types";

/** 82-0 webpack module 7977 — era multipliers on raw per-game stats (adjustedStats). */
export const ERA_MULTIPLIERS: Record<
  Era,
  { pts: number; reb: number; ast: number; stl: number; blk: number }
> = {
  "1950s": { pts: 0.8, reb: 0.62, ast: 0.85, stl: 0.9, blk: 0.9 },
  "1960s": { pts: 0.8, reb: 0.62, ast: 0.85, stl: 0.9, blk: 0.9 },
  "1970s": { pts: 0.88, reb: 0.78, ast: 0.9, stl: 0.95, blk: 0.95 },
  "1980s": { pts: 0.94, reb: 0.92, ast: 0.95, stl: 1, blk: 1 },
  "1990s": { pts: 1, reb: 1, ast: 1, stl: 1, blk: 1 },
  "2000s": { pts: 1.04, reb: 1, ast: 1, stl: 1.05, blk: 1 },
  "2010s": { pts: 1, reb: 0.98, ast: 0.98, stl: 1.05, blk: 1.05 },
  "2020s": { pts: 0.94, reb: 0.96, ast: 0.96, stl: 1.1, blk: 1.1 },
};

export const DEFAULT_ERA: Era = "1990s";

/** Target lineup totals for ratio scoring (82-0 `S` constant). */
export const LINEUP_TOTALS = {
  pts: 122,
  reb: 44,
  ast: 27,
  stl: 7.2,
  blk: 4.6,
} as const;

export type BasketballStatKey = keyof typeof LINEUP_TOTALS;

export const CATEGORY_WEIGHTS: Record<BasketballStatKey, number> = {
  pts: 0.3,
  reb: 0.2,
  ast: 0.2,
  stl: 0.15,
  blk: 0.15,
};

/** 82-0 classic difficulty exponent base (× difficulty multiplier, default 1). */
export const WIN_CURVE_EXPONENT = 2.6;

export const GATE_RATIO_LOW = 0.6;
export const GATE_CAP_LOW = 68;
export const GATE_RATIO_MID = 0.75;
export const GATE_CAP_MID = 76;

export const MIN_WINS = 8;
export const MAX_WINS = 82;
export const MAX_WINS_BEFORE_LUCK = 81;

/** ponytail: 82-0 playstyle ratio nudges — upgrade when chunk multipliers extracted */
export const PLAYSTYLE_RATIO_MULT: Record<
  import("@/lib/types").BasketballPlaystyle,
  Record<BasketballStatKey, number>
> = {
  balanced: { pts: 1, reb: 1, ast: 1, stl: 1, blk: 1 },
  small_ball: { pts: 1, reb: 0.94, ast: 1.08, stl: 1.06, blk: 0.92 },
  twin_towers: { pts: 1, reb: 1.1, ast: 0.96, stl: 0.94, blk: 1.12 },
  run_and_gun: { pts: 1.08, reb: 0.92, ast: 1.06, stl: 1, blk: 0.9 },
};

/** Draft pool production weights on era-adjusted stats. */
export const PRODUCTION_WEIGHTS = {
  pts: 1,
  reb: 1.1,
  ast: 1.4,
  stl: 4,
  blk: 4,
} as const;
