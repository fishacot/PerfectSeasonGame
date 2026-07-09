import type { Era, SportId } from "@/lib/types";

/** Eras present in 38-0.org player DB (no 1990s on org). */
export const FOOTBALL_ERAS = ["2000s", "2010s", "2020s"] as const;
/** @deprecated org has no 1980s/1990s — alias of FOOTBALL_ERAS for old call sites. */
export const FOOTBALL_ERAS_EXTENDED = FOOTBALL_ERAS;

export const HOCKEY_ERAS = [
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
] as const satisfies readonly Era[];

export const BASKETBALL_ERAS = [
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
] as const satisfies readonly Era[];

export type FootballEraRules = {
  sport: "football";
  minPerEra: number;
  maxPerEra: number;
  requiredEras: number;
};

export type DistinctEraRules = {
  sport: "hockey";
  maxPerEra: 1;
  requiredDistinct: number;
};

export type RepeatEraRules = {
  sport: "basketball";
  maxPerEra: 5;
  rosterSize: 5;
};

export type EraRules = FootballEraRules | DistinctEraRules | RepeatEraRules;

export const ERA_RULES: Record<SportId, EraRules> = {
  football: {
    sport: "football",
    minPerEra: 1,
    maxPerEra: 4,
    // ponytail: 38-0.org has 3 decades — require all three, not four.
    requiredEras: 3,
  },
  basketball: {
    sport: "basketball",
    maxPerEra: 5,
    rosterSize: 5,
  },
  hockey: {
    sport: "hockey",
    maxPerEra: 1,
    requiredDistinct: 6,
  },
};

export function getErasForSport(
  sport: SportId,
  extended = false,
): readonly Era[] {
  switch (sport) {
    case "football":
      return extended ? FOOTBALL_ERAS_EXTENDED : FOOTBALL_ERAS;
    case "basketball":
      return BASKETBALL_ERAS;
    case "hockey":
      return HOCKEY_ERAS;
    default: {
      const _exhaustive: never = sport;
      return _exhaustive;
    }
  }
}

export function seasonToEra(seasonStartYear: number): Era {
  const decade = Math.floor(seasonStartYear / 10) * 10;
  return `${decade}s` as Era;
}

export const ERA_COLORS: Record<string, string> = {
  "1950s": "#64748b",
  "1960s": "#78716c",
  "1970s": "#a16207",
  "1980s": "#7c3aed",
  "1990s": "#2563eb",
  "2000s": "#059669",
  "2010s": "#dc2626",
  "2020s": "#00C853",
};
