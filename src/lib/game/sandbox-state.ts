import type { Era, PlayerSeason, SimulationResult, SportId } from "@/lib/types";
import type { BasketballMatchResult } from "@/lib/simulation/match/basketball-match";
import type { FootballMatchResult } from "@/lib/simulation/match/football-match";
import { SPORTS } from "@/lib/config/sports";
import { PLAYER_NAME_ALIASES_RU } from "@/lib/data/player-name-aliases.ru";
import {
  hasCyrillic,
  latinToCyrillic,
  matchesTransliteratedName,
} from "@/lib/data/name-transliterate";
import { basketballPoolSortScore, basketballProductionScore } from "@/lib/simulation/basketball/engine";
import { sortPoolPlayers } from "@/lib/game/validation";

export type SandboxSubmode = "lineup" | "match";
export type SandboxPhase = "submode" | "building" | "simulating" | "result";
export type MatchSide = "home" | "away";

export type MatchResult = BasketballMatchResult | FootballMatchResult;

export interface SandboxState {
  sport: SportId;
  submode: SandboxSubmode | null;
  phase: SandboxPhase;
  /** Lineup mode: single roster. Match mode: home roster. */
  homeSlots: (PlayerSeason | null)[];
  awaySlots: (PlayerSeason | null)[];
  activeSide: MatchSide;
  search: string;
  seasonResult: SimulationResult | null;
  matchResult: MatchResult | null;
  error: string | null;
  homeLabel: string;
  awayLabel: string;
}

function emptySlots(n: number): (PlayerSeason | null)[] {
  return Array.from({ length: n }, () => null);
}

export function createSandboxState(
  sport: SportId,
  homeLabel = "Home",
  awayLabel = "Away",
): SandboxState {
  const n = SPORTS[sport].rosterSize;
  return {
    sport,
    submode: null,
    phase: "submode",
    homeSlots: emptySlots(n),
    awaySlots: emptySlots(n),
    activeSide: "home",
    search: "",
    seasonResult: null,
    matchResult: null,
    error: null,
    homeLabel,
    awayLabel,
  };
}

export type SandboxAction =
  | { type: "SET_SUBMODE"; submode: SandboxSubmode }
  | { type: "SET_SEARCH"; query: string }
  | { type: "SET_ACTIVE_SIDE"; side: MatchSide }
  | { type: "ADD_PLAYER"; player: PlayerSeason }
  | { type: "REMOVE_SLOT"; side: MatchSide; index: number }
  | { type: "CLEAR_SIDE"; side: MatchSide }
  | { type: "CLEAR_ALL" }
  | { type: "SIMULATE_START" }
  | { type: "SIMULATE_SEASON_SUCCESS"; result: SimulationResult }
  | { type: "SIMULATE_MATCH_SUCCESS"; result: MatchResult }
  | { type: "SIMULATE_ERROR"; error: string }
  | { type: "BACK_TO_SUBMODE" }
  | { type: "RESET" };

function firstEmpty(slots: (PlayerSeason | null)[]): number {
  return slots.findIndex((s) => s === null);
}

function usedIds(state: SandboxState): Set<string> {
  const ids = new Set<string>();
  for (const p of state.homeSlots) if (p) ids.add(p.id);
  if (state.submode === "match") {
    for (const p of state.awaySlots) if (p) ids.add(p.id);
  }
  return ids;
}

export function sandboxReducer(state: SandboxState, action: SandboxAction): SandboxState {
  switch (action.type) {
    case "SET_SUBMODE":
      return {
        ...createSandboxState(state.sport, state.homeLabel, state.awayLabel),
        submode: action.submode,
        phase: "building",
      };
    case "SET_SEARCH":
      return { ...state, search: action.query };
    case "SET_ACTIVE_SIDE":
      return { ...state, activeSide: action.side, search: "" };
    case "ADD_PLAYER": {
      const used = usedIds(state);
      if (used.has(action.player.id)) return state;
      const side = state.submode === "match" ? state.activeSide : "home";
      const slots = side === "home" ? [...state.homeSlots] : [...state.awaySlots];
      const idx = firstEmpty(slots);
      if (idx < 0) return state;
      slots[idx] = action.player;
      return side === "home"
        ? { ...state, homeSlots: slots, search: "", seasonResult: null, matchResult: null }
        : { ...state, awaySlots: slots, search: "", matchResult: null };
    }
    case "REMOVE_SLOT": {
      if (action.side === "home") {
        const homeSlots = [...state.homeSlots];
        homeSlots[action.index] = null;
        return { ...state, homeSlots, seasonResult: null, matchResult: null };
      }
      const awaySlots = [...state.awaySlots];
      awaySlots[action.index] = null;
      return { ...state, awaySlots, matchResult: null };
    }
    case "CLEAR_SIDE": {
      const n = SPORTS[state.sport].rosterSize;
      if (action.side === "home") {
        return { ...state, homeSlots: emptySlots(n), seasonResult: null, matchResult: null };
      }
      return { ...state, awaySlots: emptySlots(n), matchResult: null };
    }
    case "CLEAR_ALL":
      return {
        ...createSandboxState(state.sport, state.homeLabel, state.awayLabel),
        submode: state.submode,
        phase: "building",
      };
    case "SIMULATE_START":
      return { ...state, phase: "simulating", error: null };
    case "SIMULATE_SEASON_SUCCESS":
      return {
        ...state,
        phase: "result",
        seasonResult: action.result,
        matchResult: null,
        error: null,
      };
    case "SIMULATE_MATCH_SUCCESS":
      return {
        ...state,
        phase: "result",
        matchResult: action.result,
        seasonResult: null,
        error: null,
      };
    case "SIMULATE_ERROR":
      return { ...state, phase: "building", error: action.error };
    case "BACK_TO_SUBMODE":
      return createSandboxState(state.sport, state.homeLabel, state.awayLabel);
    case "RESET":
      return {
        ...createSandboxState(state.sport, state.homeLabel, state.awayLabel),
        submode: state.submode,
        phase: state.submode ? "building" : "submode",
      };
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

const ERA_RANK: Record<Era, number> = {
  "1950s": 0,
  "1960s": 1,
  "1970s": 2,
  "1980s": 3,
  "1990s": 4,
  "2000s": 5,
  "2010s": 6,
  "2020s": 7,
};

/** Strip diacritics for search / peak grouping (Dragic ↔ Dragić). */
export function normalizeSandboxName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function peakBetter(a: PlayerSeason, b: PlayerSeason): boolean {
  const sa = basketballProductionScore(a);
  const sb = basketballProductionScore(b);
  if (sa !== sb) return sa > sb;
  if (a.rating !== b.rating) return a.rating > b.rating;
  return ERA_RANK[a.era] > ERA_RANK[b.era];
}

/** One franchise×era row per person — max era-adjusted production (draft order). */
export function peakSandboxPlayers(players: PlayerSeason[]): PlayerSeason[] {
  const best = new Map<string, PlayerSeason>();
  for (const p of players) {
    const key = normalizeSandboxName(p.name);
    const cur = best.get(key);
    if (!cur || peakBetter(p, cur)) best.set(key, p);
  }
  return [...best.values()];
}

export function matchesSandboxQuery(player: PlayerSeason, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return false;
  const name = normalizeSandboxName(player.name);
  const club = normalizeSandboxName(player.club);
  if (name.includes(q) || club.includes(q) || player.era.includes(q)) return true;
  if (matchesTransliteratedName(player.name, q)) return true;
  if (hasCyrillic(q) && matchesTransliteratedName(player.club, q)) return true;
  const aliases = PLAYER_NAME_ALIASES_RU[name];
  if (aliases?.some((a) => a.includes(q))) return true;
  return false;
}

export function filterSandboxPlayers(
  sport: SportId,
  players: PlayerSeason[],
  query: string,
  used: Set<string>,
  limit = 40,
): PlayerSeason[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const matched = players.filter(
    (p) => !used.has(p.id) && matchesSandboxQuery(p, q),
  );
  return sortPoolPlayers(sport, matched).slice(0, limit);
}

export function sandboxLineup(slots: (PlayerSeason | null)[]): PlayerSeason[] {
  return slots.filter((p): p is PlayerSeason => p !== null);
}

export function sandboxReady(slots: (PlayerSeason | null)[]): boolean {
  return slots.every((s) => s !== null);
}

export function matchReady(state: SandboxState): boolean {
  return sandboxReady(state.homeSlots) && sandboxReady(state.awaySlots);
}

/** ponytail: assert self-check — run via `npx tsx src/lib/game/sandbox-state.ts` */
export function runSandboxSelfCheck(): void {
  const wiltLow: PlayerSeason = {
    id: "wilt-low",
    name: "Wilt Chamberlain",
    club: "Lakers",
    era: "1970s",
    positions: ["C"],
    stats: { ppg: 20, rpg: 18, apg: 4, spg: 0, bpg: 0 },
    rating: 90,
  };
  const wiltPeak: PlayerSeason = {
    id: "wilt-peak",
    name: "Wilt Chamberlain",
    club: "Warriors",
    era: "1960s",
    positions: ["C"],
    stats: { ppg: 37, rpg: 27, apg: 2, spg: 0, bpg: 0 },
    rating: 99,
  };
  const lebronA: PlayerSeason = {
    id: "lbj-a",
    name: "LeBron James",
    club: "Cavaliers",
    era: "2000s",
    positions: ["SF"],
    stats: { ppg: 27, rpg: 7, apg: 7, spg: 1.7, bpg: 0.8 },
    rating: 96,
  };
  const lebronB: PlayerSeason = {
    id: "lbj-b",
    name: "LeBron James",
    club: "Lakers",
    era: "2020s",
    positions: ["SF"],
    stats: { ppg: 25, rpg: 7, apg: 8, spg: 1.1, bpg: 0.5 },
    rating: 94,
  };
  const ant: PlayerSeason = {
    id: "ant",
    name: "Anthony Edwards",
    club: "Timberwolves",
    era: "2020s",
    positions: ["SG"],
    stats: { ppg: 26, rpg: 5, apg: 5, spg: 1.3, bpg: 0.5 },
    rating: 92,
  };
  const doncic: PlayerSeason = {
    id: "luka",
    name: "Luka Dončić",
    club: "Mavericks",
    era: "2020s",
    positions: ["PG"],
    stats: { ppg: 33, rpg: 9, apg: 9, spg: 1.4, bpg: 0.5 },
    rating: 96,
  };
  const weak: PlayerSeason = {
    id: "weak",
    name: "Bench Guy",
    club: "Lakers",
    era: "2020s",
    positions: ["SG"],
    stats: { ppg: 4, rpg: 1, apg: 1, spg: 0.2, bpg: 0 },
    rating: 60,
  };

  const peaked = peakSandboxPlayers([wiltLow, wiltPeak, lebronA, lebronB, ant, doncic, weak]);
  console.assert(peaked.length === 5, "peak collapses same-name seasons");
  console.assert(
    peaked.filter((p) => p.name === "Wilt Chamberlain").length === 1 &&
      peaked.some((p) => p.id === "wilt-peak"),
    "Wilt keeps peak season",
  );
  console.assert(
    peaked.filter((p) => p.name === "LeBron James").length === 1,
    "LeBron one peak",
  );

  console.assert(normalizeSandboxName("Luka Dončić") === "luka doncic", "diacritic strip");
  console.assert(matchesSandboxQuery(ant, "энтони эдвардс"), "ru full name");
  console.assert(matchesSandboxQuery(ant, "эдвардс"), "ru surname");
  console.assert(matchesSandboxQuery(doncic, "doncic"), "diacritic query");
  // Auto-translit for players with no manual alias entry
  console.assert(matchesSandboxQuery(weak, "бенч"), "auto translit any player");
  console.assert(
    matchesSandboxQuery(
      {
        id: "x",
        name: "Paolo Banchero",
        club: "Magic",
        era: "2020s",
        positions: ["PF"],
        stats: { ppg: 20, rpg: 7, apg: 4, spg: 1, bpg: 1 },
        rating: 85,
      },
      "паоло",
    ),
    "auto translit without alias map",
  );
  console.assert(latinToCyrillic("Anthony Edwards").length > 0, "translit non-empty");

  const ranked = filterSandboxPlayers(
    "basketball",
    [weak, ant, doncic],
    "20",
    new Set(),
  );
  console.assert(
    ranked.length === 3 &&
      basketballPoolSortScore(ranked[0]!) >= basketballPoolSortScore(ranked[1]!) &&
      basketballPoolSortScore(ranked[1]!) >= basketballPoolSortScore(ranked[2]!),
    "results sorted by PPG desc",
  );
  const antHits = filterSandboxPlayers("basketball", peaked, "эдвардс", new Set());
  console.assert(
    antHits.some((p) => p.name === "Anthony Edwards"),
    "ru search finds Anthony Edwards",
  );
}

if (typeof require !== "undefined" && require.main === module) {
  runSandboxSelfCheck();
  console.log("sandbox-state self-check ok");
}
