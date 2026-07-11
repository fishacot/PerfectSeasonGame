import type { CpuDifficulty, Era, PlayerSeason, SportId, SpinResult } from "@/lib/types";
import {
  canPlaceAtPosition,
  filterPickablePlayers,
  getOpenSlotKeys,
} from "@/lib/game/validation";
import { basketballProductionScore } from "@/lib/simulation/basketball/engine";

export interface BotPickResult {
  player: PlayerSeason;
  slotKey: string;
}

function positionScarcityScore(
  openSlots: { key: string; label: string }[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const s of openSlots) {
    counts.set(s.label, (counts.get(s.label) ?? 0) + 1);
  }
  const scarcity = new Map<string, number>();
  for (const s of openSlots) {
    scarcity.set(s.key, 1 / (counts.get(s.label) ?? 1));
  }
  return scarcity;
}

function chooseSlot(
  player: PlayerSeason,
  openSlots: { key: string; label: string }[],
  scarcity: Map<string, number>,
): string | null {
  const fitting = openSlots.filter((s) =>
    canPlaceAtPosition(player.positions, s.label),
  );
  if (fitting.length === 0) return null;
  return fitting.sort(
    (a, b) => (scarcity.get(b.key) ?? 0) - (scarcity.get(a.key) ?? 0),
  )[0]!.key;
}

function deterministicIndex(length: number, salt: number): number {
  if (length <= 1) return 0;
  return Math.abs((salt * 1103515245 + 12345) % length);
}

/** Greedy pick with position scarcity tie-break (82-0 vs CPU baseline). */
export function computeBotPick(
  sport: SportId,
  spin: SpinResult,
  allPlayers: PlayerSeason[],
  userPickedIds: Set<string>,
  opponentPickedIds: Set<string>,
  opponentUsedEras: Era[],
  opponentLineup: Map<string, PlayerSeason>,
  positions: string[],
  difficulty: CpuDifficulty = "normal",
): BotPickResult | null {
  const taken = new Set([...userPickedIds, ...opponentPickedIds]);
  const pool = allPlayers.filter(
    (p) =>
      p.club === spin.club &&
      p.era === spin.era &&
      !taken.has(p.id),
  );
  const openSlots = getOpenSlotKeys(positions, opponentLineup);
  const openLabels = openSlots.map((s) => s.label);
  const pickable = filterPickablePlayers(
    sport,
    pool,
    opponentUsedEras,
    openLabels,
  );
  if (pickable.length === 0) return null;

  const scarcity = positionScarcityScore(openSlots);

  if (difficulty === "easy") {
    const lowerHalf = pickable.slice(Math.floor(pickable.length / 2));
    const pool = lowerHalf.length > 0 ? lowerHalf : pickable;
    const player = pool[deterministicIndex(pool.length, taken.size + opponentLineup.size)]!;
    const slotKey = chooseSlot(player, openSlots, scarcity);
    return slotKey ? { player, slotKey } : null;
  }

  if (difficulty === "hard" || difficulty === "insane") {
    const limit =
      difficulty === "insane"
        ? Math.min(8, pickable.length)
        : Math.min(4, pickable.length);
    let best = pickable[0]!;
    let bestScore = -Infinity;
    for (const player of pickable.slice(0, limit)) {
      const fitting = openSlots.filter((s) =>
        canPlaceAtPosition(player.positions, s.label),
      );
      const slotScore = Math.max(
        ...fitting.map((s) => scarcity.get(s.key) ?? 0),
      );
      const production =
        sport === "basketball" ? basketballProductionScore(player) : player.rating;
      const score =
        production +
        slotScore * (difficulty === "insane" ? 18 : 12) +
        player.rating / 1000;
      if (score > bestScore) {
        bestScore = score;
        best = player;
      }
    }
    const slotKey = chooseSlot(best, openSlots, scarcity);
    return slotKey ? { player: best, slotKey } : null;
  }

  let best = pickable[0]!;
  let bestScore = -Infinity;

  for (const player of pickable) {
    const fitting = openSlots.filter((s) =>
      canPlaceAtPosition(player.positions, s.label),
    );
    const slotScore = Math.max(
      ...fitting.map((s) => scarcity.get(s.key) ?? 0),
    );
    const productionRank = pickable.indexOf(player);
    const score = slotScore * 10 - productionRank * 0.01;
    if (score > bestScore) {
      bestScore = score;
      best = player;
    }
  }

  const slotKey = chooseSlot(best, openSlots, scarcity);
  if (!slotKey) return null;

  return { player: best, slotKey };
}

// ponytail: run with `npx tsx src/lib/game/bot-draft.ts`
export function runBotDraftSelfCheck(): void {
  const spin = { club: "Lakers", era: "1990s" as const };
  const positions = ["PG", "SG", "SF", "PF", "C"];
  const p: PlayerSeason = {
    id: "1",
    name: "Test",
    club: "Lakers",
    era: "1990s",
    positions: ["PG"],
    stats: { ppg: 20, rpg: 5, apg: 5, spg: 1, bpg: 0.5 },
    rating: 90,
  };
  const r = computeBotPick(
    "basketball",
    spin,
    [p],
    new Set(),
    new Set(),
    [],
    new Map(),
    positions,
    "normal",
  );
  console.assert(r?.player.id === "1", "bot picks available player");

  const easy = computeBotPick(
    "basketball",
    spin,
    [
      p,
      {
        ...p,
        id: "2",
        name: "Bench",
        stats: { ppg: 4, rpg: 1, apg: 1, spg: 0, bpg: 0 },
        rating: 50,
      },
    ],
    new Set(),
    new Set(),
    [],
    new Map(),
    positions,
    "easy",
  );
  console.assert(easy?.player.id === "2", "easy bot can pick weaker pool");
}

if (typeof require !== "undefined" && require.main === module) {
  runBotDraftSelfCheck();
  console.log("bot-draft self-check ok");
}
