import type { PlayerSeason, SimulationResult, SportId } from "@/lib/types";
import type { BasketballMatchResult } from "@/lib/simulation/match/basketball-match";
import type { FootballMatchResult } from "@/lib/simulation/match/football-match";
import { SPORTS } from "@/lib/config/sports";

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

export function filterSandboxPlayers(
  players: PlayerSeason[],
  query: string,
  used: Set<string>,
  limit = 40,
): PlayerSeason[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const out: PlayerSeason[] = [];
  for (const p of players) {
    if (used.has(p.id)) continue;
    if (
      p.name.toLowerCase().includes(q) ||
      p.club.toLowerCase().includes(q) ||
      p.era.includes(q)
    ) {
      out.push(p);
      if (out.length >= limit) break;
    }
  }
  return out;
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
