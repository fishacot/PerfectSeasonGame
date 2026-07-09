import type { Era, PlayerSeason, SportId, SpinResult } from "@/lib/types";
import {
  canPlaceAtPosition,
  filterPickablePlayers,
  getOpenSlotKeys,
} from "@/lib/game/validation";

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

/** Greedy pick with position scarcity tie-break (82-0 daily CPU). */
export function computeBotPick(
  sport: SportId,
  spin: SpinResult,
  allPlayers: PlayerSeason[],
  userPickedIds: Set<string>,
  opponentPickedIds: Set<string>,
  opponentUsedEras: Era[],
  opponentLineup: Map<string, PlayerSeason>,
  positions: string[],
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

  const slot = openSlots.find((s) =>
    canPlaceAtPosition(best.positions, s.label),
  );
  if (!slot) return null;

  return { player: best, slotKey: slot.key };
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
  );
  console.assert(r?.player.id === "1", "bot picks available player");
}

if (typeof require !== "undefined" && require.main === module) {
  runBotDraftSelfCheck();
  console.log("bot-draft self-check ok");
}
