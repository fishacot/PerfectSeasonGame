import type {
  DraftPick,
  Era,
  FootballDifficulty,
  FootballLeague,
  GameMode,
  PlayerSeason,
  SimulationResult,
  SpinResult,
  SportId,
} from "@/lib/types";
import { spinTeamEraWithPool, getPlayersForSpin, spinClubWithPool, spinEraWithPool } from "@/lib/game/spin";
import { canPickPlayer, isRosterEraValid } from "@/lib/game/validation";
import { computeBotPick } from "@/lib/game/bot-draft";

export type DraftPhase =
  | "mode-select"
  | "spinning"
  | "picking"
  | "placing"
  | "opponent-draft"
  | "simulating"
  | "result";

export interface DraftState {
  sport: SportId;
  league?: FootballLeague;
  mode: GameMode;
  phase: DraftPhase;
  round: number;
  rosterSize: number;
  currentSpin: SpinResult | null;
  availablePlayers: PlayerSeason[];
  picks: DraftPick[];
  lineup: Map<string, PlayerSeason>;
  pendingPlayer: PlayerSeason | null;
  spins: SpinResult[];
  rerollsRemaining: number;
  skipsUsed: { team: boolean; era: boolean };
  usedEras: Era[];
  clubs: string[];
  eras: readonly Era[];
  allPlayers: PlayerSeason[];
  result: SimulationResult | null;
  botResult: SimulationResult | null;
  dailySpins: SpinResult[] | null;
  opponentLineup: Map<string, PlayerSeason>;
  opponentPicks: DraftPick[];
  opponentUsedEras: Era[];
  botReveal: { player: PlayerSeason; slotKey: string } | null;
  difficulty: FootballDifficulty;
}

export type DraftAction =
  | { type: "SET_MODE"; mode: GameMode }
  | { type: "SET_DIFFICULTY"; difficulty: FootballDifficulty }
  | { type: "START"; dailySpins?: SpinResult[] }
  | { type: "SPIN"; openSlotLabels: string[] }
  | { type: "SKIP_TEAM"; openSlotLabels: string[] }
  | { type: "SKIP_ERA"; openSlotLabels: string[] }
  | { type: "PICK"; player: PlayerSeason }
  | { type: "PLACE"; slot: string }
  | { type: "BOT_PICK"; positions: string[] }
  | { type: "SET_RESULT"; result: SimulationResult }
  | { type: "SET_VERSUS_RESULTS"; user: SimulationResult; bot: SimulationResult }
  | { type: "RESET" };

function allPickedIds(userPicks: DraftPick[], opponentPicks: DraftPick[]): Set<string> {
  return new Set([
    ...pickedIds(userPicks),
    ...pickedIds(opponentPicks),
  ]);
}

function pickedIds(picks: DraftPick[]): Set<string> {
  return new Set(picks.map((p) => p.player.id));
}

export function createInitialState(
  sport: SportId,
  rosterSize: number,
  clubs: string[],
  eras: readonly Era[],
  players: PlayerSeason[],
  league?: FootballLeague,
): DraftState {
  return {
    sport,
    league,
    mode: "classic",
    phase: "mode-select",
    round: 0,
    rosterSize,
    currentSpin: null,
    availablePlayers: [],
    picks: [],
    lineup: new Map(),
    pendingPlayer: null,
    spins: [],
    rerollsRemaining: 0, // ponytail: wire SET_DIFFICULTY for app Easy/Normal/Hard rerolls
    skipsUsed: { team: false, era: false },
    usedEras: [],
    clubs,
    eras,
    allPlayers: players,
    result: null,
    botResult: null,
    dailySpins: null,
    opponentLineup: new Map(),
    opponentPicks: [],
    opponentUsedEras: [],
    botReveal: null,
    difficulty: "normal",
  };
}

export function draftReducer(
  state: DraftState,
  action: DraftAction,
): DraftState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.mode };
    case "SET_DIFFICULTY": {
      const mode = action.difficulty === "hard" ? "blind" : state.mode;
      return {
        ...state,
        difficulty: action.difficulty,
        mode,
        rerollsRemaining: 0,
      };
    }
    case "START": {
      const daily = action.dailySpins ?? null;
      if (daily && daily.length > 0) {
        const spin = daily[0];
        const players = getPlayersForSpin(
          state.sport,
          state.allPlayers,
          spin,
          allPickedIds(state.picks, state.opponentPicks),
        );
        return {
          ...state,
          phase: "picking",
          round: 1,
          dailySpins: daily,
          currentSpin: spin,
          availablePlayers: players,
          rerollsRemaining: 0,
          skipsUsed: { team: false, era: false },
          opponentLineup: new Map(),
          opponentPicks: [],
          opponentUsedEras: [],
          botReveal: null,
          botResult: null,
        };
      }
      return {
        ...state,
        phase: "spinning",
        dailySpins: null,
        rerollsRemaining: 0,
        skipsUsed: { team: false, era: false },
      };
    }
    case "SPIN": {
      const picked = pickedIds(state.picks);
      const spin = spinTeamEraWithPool(
        state.sport,
        state.clubs,
        state.eras,
        state.usedEras,
        state.allPlayers,
        picked,
        action.openSlotLabels,
      );
      const players = getPlayersForSpin(state.sport, state.allPlayers, spin, picked);
      return {
        ...state,
        phase: "picking",
        round: state.round + 1,
        currentSpin: spin,
        availablePlayers: players,
        spins: [...state.spins, spin],
      };
    }
    case "SKIP_TEAM": {
      if (!state.currentSpin) return state;
      if (state.skipsUsed.team) return state;
      if (state.dailySpins) return state;
      const picked = pickedIds(state.picks);
      const spin = {
        ...state.currentSpin,
        club: spinClubWithPool(
          state.sport,
          state.clubs,
          state.currentSpin.era,
          state.usedEras,
          state.allPlayers,
          picked,
          action.openSlotLabels,
        ),
      };
      const players = getPlayersForSpin(state.sport, state.allPlayers, spin, picked);
      return {
        ...state,
        currentSpin: spin,
        availablePlayers: players,
        skipsUsed: { ...state.skipsUsed, team: true },
      };
    }
    case "SKIP_ERA": {
      if (!state.currentSpin) return state;
      if (state.skipsUsed.era) return state;
      if (state.dailySpins) return state;
      const picked = pickedIds(state.picks);
      const newEra = spinEraWithPool(
        state.sport,
        state.currentSpin.club,
        state.eras,
        state.usedEras,
        state.allPlayers,
        picked,
        action.openSlotLabels,
      );
      const spin = { ...state.currentSpin, era: newEra };
      const players = getPlayersForSpin(state.sport, state.allPlayers, spin, picked);
      return {
        ...state,
        currentSpin: spin,
        availablePlayers: players,
        skipsUsed: { ...state.skipsUsed, era: true },
      };
    }
    case "PICK": {
      if (!canPickPlayer(state.sport, action.player.era, state.usedEras)) {
        return state;
      }
      return {
        ...state,
        phase: "placing",
        pendingPlayer: action.player,
      };
    }
    case "PLACE": {
      if (!state.pendingPlayer || !state.currentSpin) return state;
      const pick: DraftPick = {
        player: state.pendingPlayer,
        slotPosition: action.slot,
        round: state.round,
      };
      const newLineup = new Map(state.lineup);
      newLineup.set(action.slot, state.pendingPlayer);
      const newPicks = [...state.picks, pick];
      const newUsedEras = [...state.usedEras, state.pendingPlayer.era];

      if (state.mode === "daily" && state.dailySpins) {
        return {
          ...state,
          picks: newPicks,
          lineup: newLineup,
          usedEras: newUsedEras,
          pendingPlayer: null,
          phase: "opponent-draft",
          botReveal: null,
        };
      }

      if (newPicks.length >= state.rosterSize) {
        if (!isRosterEraValid(state.sport, newUsedEras, state.eras)) {
          return state;
        }
        return {
          ...state,
          picks: newPicks,
          lineup: newLineup,
          usedEras: newUsedEras,
          pendingPlayer: null,
          phase: "simulating",
        };
      }

      if (state.dailySpins && state.round < state.dailySpins.length) {
        const spin = state.dailySpins[state.round];
        const players = getPlayersForSpin(
          state.sport,
          state.allPlayers,
          spin,
          allPickedIds(newPicks, state.opponentPicks),
        );
        return {
          ...state,
          picks: newPicks,
          lineup: newLineup,
          usedEras: newUsedEras,
          pendingPlayer: null,
          round: state.round + 1,
          currentSpin: spin,
          availablePlayers: players,
          phase: "picking",
          spins: [...state.spins, spin],
        };
      }

      return {
        ...state,
        picks: newPicks,
        lineup: newLineup,
        usedEras: newUsedEras,
        pendingPlayer: null,
        currentSpin: null,
        availablePlayers: [],
        phase: "spinning",
      };
    }
    case "BOT_PICK": {
      if (state.mode !== "daily" || !state.currentSpin || state.phase !== "opponent-draft") {
        return state;
      }
      const bot = computeBotPick(
        state.sport,
        state.currentSpin,
        state.allPlayers,
        pickedIds(state.picks),
        pickedIds(state.opponentPicks),
        state.opponentUsedEras,
        state.opponentLineup,
        action.positions,
      );
      if (!bot) {
        return { ...state, phase: "simulating", botReveal: null };
      }
      const oppPick: DraftPick = {
        player: bot.player,
        slotPosition: bot.slotKey,
        round: state.round,
      };
      const newOppLineup = new Map(state.opponentLineup);
      newOppLineup.set(bot.slotKey, bot.player);
      const newOppPicks = [...state.opponentPicks, oppPick];
      const newOppUsedEras = [...state.opponentUsedEras, bot.player.era];

      if (state.picks.length >= state.rosterSize) {
        return {
          ...state,
          opponentLineup: newOppLineup,
          opponentPicks: newOppPicks,
          opponentUsedEras: newOppUsedEras,
          botReveal: bot,
          phase: "simulating",
        };
      }

      const nextRound = state.round + 1;
      const nextSpin = state.dailySpins![nextRound - 1];
      const players = getPlayersForSpin(
        state.sport,
        state.allPlayers,
        nextSpin,
        allPickedIds(state.picks, newOppPicks),
      );
      return {
        ...state,
        opponentLineup: newOppLineup,
        opponentPicks: newOppPicks,
        opponentUsedEras: newOppUsedEras,
        botReveal: bot,
        round: nextRound,
        currentSpin: nextSpin,
        availablePlayers: players,
        phase: "picking",
        spins: [...state.spins, nextSpin],
      };
    }
    case "SET_RESULT":
      return { ...state, phase: "result", result: action.result };
    case "SET_VERSUS_RESULTS":
      return {
        ...state,
        phase: "result",
        result: action.user,
        botResult: action.bot,
      };
    case "RESET":
      return createInitialState(
        state.sport,
        state.rosterSize,
        state.clubs,
        state.eras,
        state.allPlayers,
        state.league,
      );
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
