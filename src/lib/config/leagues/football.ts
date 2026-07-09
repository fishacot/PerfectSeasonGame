import type { FootballLeague } from "@/lib/types";
import { FOOTBALL_ERAS } from "@/lib/config/eras";

export interface FootballLeagueConfig {
  id: FootballLeague;
  name: { en: string; ru: string };
  seasonGames: number;
  brand: string;
  /** Always false — 38-0.org only has 2000s/2010s/2020s. */
  extendedEras: boolean;
  clubs: string[];
}

/**
 * Three popular leagues only.
 * Clubs = intersection of FOOTBALL_LEAGUES intent × 38-0.org UCL pool
 * (plus EPL big-six from org; app expands EPL later).
 */
export const FOOTBALL_LEAGUES: Record<FootballLeague, FootballLeagueConfig> = {
  epl: {
    id: "epl",
    name: { en: "Premier League", ru: "Премьер-лига" },
    seasonGames: 38,
    brand: "38-0",
    extendedEras: false,
    clubs: [
      "Arsenal",
      "Chelsea",
      "Liverpool",
      "Manchester City",
      "Manchester United",
      "Tottenham",
    ],
  },
  laliga: {
    id: "laliga",
    name: { en: "La Liga", ru: "Ла Лига" },
    seasonGames: 38,
    brand: "38-0",
    extendedEras: false,
    clubs: [
      "Barcelona",
      "Real Madrid",
      "Atletico Madrid",
      "Sevilla",
    ],
  },
  seriea: {
    id: "seriea",
    name: { en: "Serie A", ru: "Серия A" },
    seasonGames: 38,
    brand: "38-0",
    extendedEras: false,
    clubs: [
      "AC Milan",
      "Inter Milan",
      "Juventus",
      "Napoli",
    ],
  },
};

export function getFootballEras(_league: FootballLeague) {
  return FOOTBALL_ERAS;
}
