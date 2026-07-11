export type Locale = "en" | "ru";

export type SportId = "football" | "basketball" | "hockey";

export type GameMode = "classic" | "blind" | "cpu";

export type CpuDifficulty = "easy" | "normal" | "hard" | "insane";

export type BasketballPlaystyle =
  | "balanced"
  | "small_ball"
  | "twin_towers"
  | "run_and_gun";

export type SeasonReveal = "instant" | "live";

export type FootballDifficulty = "easy" | "normal" | "hard";

export type Era =
  | "1950s"
  | "1960s"
  | "1970s"
  | "1980s"
  | "1990s"
  | "2000s"
  | "2010s"
  | "2020s";

/** Top-3 leagues only — 38-0 parity model (EPL + La Liga + Serie A). */
export type FootballLeague = "epl" | "laliga" | "seriea";

export interface PlayerSeason {
  id: string;
  name: string;
  club: string;
  era: Era;
  positions: string[];
  stats: Record<string, number>;
  rating: number;
}

export interface LineupSlot {
  position: string;
  player: PlayerSeason | null;
}

export interface SpinResult {
  club: string;
  era: Era;
}

export interface SimulationBreakdown {
  categories: Record<string, number>;
  chemistry: number;
  gateMessage: string;
  weakestCategory: string;
  grade: string;
  tier: string | null;
  bestPickId: string | null;
  bestPickName: string | null;
  /** Basketball: era-adjusted lineup totals (PTS, REB, …). */
  categoryTotals?: Record<string, number>;
  /** Basketball: target totals for ratio scoring. */
  categoryTargets?: Record<string, number>;
  /** Basketball: stable i18n key for gate message */
  gateKey?: string;
  /** Basketball: weighted combo 0–100 (drives win curve). */
  combo?: number;
}

export interface SimulationResult {
  wins: number;
  losses: number;
  draws: number;
  maxWins: number;
  perfect: boolean;
  breakdown: SimulationBreakdown;
}

export interface DraftPick {
  player: PlayerSeason;
  slotPosition: string;
  round: number;
}

export interface ChallengeState {
  sport: SportId;
  league?: FootballLeague;
  mode: GameMode;
  spins: SpinResult[];
  picks: DraftPick[];
  skipsUsed: { team: boolean; era: boolean };
}
