import type { SportId } from "@/lib/types";
import { getErasForSport } from "@/lib/config/eras";

export interface SportConfig {
  id: SportId;
  name: { en: string; ru: string };
  brand: string;
  rosterSize: number;
  seasonGames: number;
  positions: string[];
  statCategories: string[];
  emoji: string;
  description: { en: string; ru: string };
}

export const SPORTS: Record<SportId, SportConfig> = {
  football: {
    id: "football",
    name: { en: "Football", ru: "Футбол" },
    brand: "38-0",
    rosterSize: 11,
    seasonGames: 38,
    positions: ["GK", "LB", "CB", "CB", "RB", "CM", "CM", "CM", "LW", "ST", "RW"],
    statCategories: ["GK", "DEF", "MID", "ATT"],
    emoji: "⚽",
    description: {
      en: "Build an all-time XI from EPL, La Liga & Serie A",
      ru: "Собери состав всех времён из АПЛ, Ла Лиги и Серии А",
    },
  },
  basketball: {
    id: "basketball",
    name: { en: "Basketball", ru: "Баскетбол" },
    brand: "82-0",
    rosterSize: 5,
    seasonGames: 82,
    positions: ["PG", "SG", "SF", "PF", "C"],
    statCategories: ["PTS", "REB", "AST", "STL", "BLK"],
    emoji: "🏀",
    description: {
      en: "Draft 5 NBA legends across 5 decades",
      ru: "Драфт 5 легенд NBA из 5 разных эр",
    },
  },
  hockey: {
    id: "hockey",
    name: { en: "Hockey", ru: "Хоккей" },
    brand: "82-0",
    rosterSize: 6,
    seasonGames: 82,
    positions: ["C", "LW", "RW", "D", "D", "G"],
    statCategories: ["Attack", "Defense", "Goaltending"],
    emoji: "🏒",
    description: {
      en: "Build a 6-man NHL lineup across 6 eras",
      ru: "Собери состав NHL из 6 разных эр",
    },
  },
};

export function getSportEras(sport: SportId, extendedFootball = false) {
  return getErasForSport(sport, extendedFootball);
}
