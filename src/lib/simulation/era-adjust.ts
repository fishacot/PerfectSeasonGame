import type { Era, SportId } from "@/lib/types";

// ponytail: static decade multipliers; upgrade path = per-season pace data
const MULTIPLIERS: Record<SportId, Record<string, number>> = {
  basketball: {
    "1960s": 0.72,
    "1970s": 0.78,
    "1980s": 0.85,
    "1990s": 0.92,
    "2000s": 0.96,
    "2010s": 0.98,
    "2020s": 1.0,
  },
  football: {
    "1980s": 0.88,
    "1990s": 0.9,
    "2000s": 0.95,
    "2010s": 0.98,
    "2020s": 1.0,
  },
  hockey: {
    "1950s": 0.7,
    "1960s": 0.75,
    "1970s": 0.8,
    "1980s": 0.86,
    "1990s": 0.91,
    "2000s": 0.95,
    "2010s": 0.98,
    "2020s": 1.0,
  },
};

export function eraMultiplier(sport: SportId, era: Era): number {
  return MULTIPLIERS[sport][era] ?? 1;
}

export function adjustRating(
  sport: SportId,
  era: Era,
  rating: number,
): number {
  return rating * eraMultiplier(sport, era);
}

export function adjustStat(
  sport: SportId,
  era: Era,
  value: number,
): number {
  return value * eraMultiplier(sport, era);
}
