import type { Era, PlayerSeason, SportId } from "@/lib/types";
import { ERA_RULES } from "@/lib/config/eras";
import { basketballProductionScore } from "@/lib/simulation/basketball/engine";

export function countByEra(eras: Era[]): Map<Era, number> {
  const map = new Map<Era, number>();
  for (const era of eras) {
    map.set(era, (map.get(era) ?? 0) + 1);
  }
  return map;
}

export function canPickPlayer(
  sport: SportId,
  playerEra: Era,
  currentEras: Era[],
): boolean {
  const rules = ERA_RULES[sport];
  const counts = countByEra(currentEras);
  const current = counts.get(playerEra) ?? 0;

  return current < rules.maxPerEra;
}

export function isRosterEraValid(
  sport: SportId,
  eras: Era[],
  requiredEraList: readonly Era[],
): boolean {
  const rules = ERA_RULES[sport];
  const counts = countByEra(eras);

  if (rules.sport === "football") {
    for (const era of requiredEraList) {
      if ((counts.get(era) ?? 0) < rules.minPerEra) return false;
    }
    return eras.length === 11;
  }

  if (rules.sport === "basketball") {
    return eras.length === rules.rosterSize;
  }

  const distinct = new Set(eras);
  return distinct.size === rules.requiredDistinct && eras.length === rules.requiredDistinct;
}

export function canPlaceAtPosition(
  playerPositions: string[],
  slotPosition: string,
): boolean {
  if (playerPositions.includes(slotPosition)) return true;
  const groups: Record<string, string[]> = {
    GK: ["GK"],
    LB: ["LB", "DF", "FB"],
    RB: ["RB", "DF", "FB"],
    CB: ["CB", "DF"],
    CM: ["CM", "MF", "DM", "AM"],
    LW: ["LW", "FW", "WF"],
    RW: ["RW", "FW", "WF"],
    LM: ["LM", "LW", "MF", "WF"],
    RM: ["RM", "RW", "MF", "WF"],
    ST: ["ST", "FW", "CF"],
    PG: ["PG"],
    SG: ["SG", "G"],
    SF: ["SF", "F"],
    PF: ["PF", "F"],
    C: ["C"],
    D: ["D"],
    G: ["G"],
  };
  const allowed = groups[slotPosition] ?? [slotPosition];
  return playerPositions.some((p) => allowed.includes(p));
}

export type PlayerSlotStatus = "pickable" | "no_slot" | "era_full";

export type PositionFilter =
  | "all"
  | "G"
  | "F"
  | "C"
  | "GK"
  | "DEF"
  | "MID"
  | "FWD";

const BASKETBALL_FILTER_POSITIONS: Record<"G" | "F" | "C", string[]> = {
  G: ["PG", "SG", "G"],
  F: ["SF", "PF", "F"],
  C: ["C"],
};

const FOOTBALL_FILTER_POSITIONS: Record<"GK" | "DEF" | "MID" | "FWD", string[]> = {
  GK: ["GK"],
  DEF: ["CB", "LB", "RB", "DF", "FB", "LWB", "RWB"],
  MID: ["CM", "DM", "AM", "MF", "LM", "RM", "CDM", "CAM"],
  FWD: ["ST", "CF", "FW", "LW", "RW", "WF"],
};

export function getPlayerSlotStatus(
  sport: SportId,
  player: PlayerSeason,
  usedEras: Era[],
  openSlotLabels: string[],
): PlayerSlotStatus {
  if (!canPickPlayer(sport, player.era, usedEras)) return "era_full";
  if (!openSlotLabels.some((slot) => canPlaceAtPosition(player.positions, slot))) {
    return "no_slot";
  }
  return "pickable";
}

export function matchesPositionFilter(
  positions: string[],
  filter: PositionFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "G" || filter === "F" || filter === "C") {
    return positions.some((p) => BASKETBALL_FILTER_POSITIONS[filter].includes(p));
  }
  return positions.some((p) => FOOTBALL_FILTER_POSITIONS[filter].includes(p));
}

export function poolPositionFilters(sport: SportId): PositionFilter[] {
  if (sport === "football") return ["all", "GK", "DEF", "MID", "FWD"];
  if (sport === "basketball") return ["all", "G", "F", "C"];
  return ["all"];
}

export function sortPoolPlayers(sport: SportId, players: PlayerSeason[]): PlayerSeason[] {
  if (sport === "basketball") {
    return [...players].sort(
      (a, b) => basketballProductionScore(b) - basketballProductionScore(a),
    );
  }
  return [...players].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });
}

/** 82-0 / 38-0: only show players who can fill an open position and pass era rules. */
export function filterPickablePlayers(
  sport: SportId,
  players: PlayerSeason[],
  usedEras: Era[],
  openSlotLabels: string[],
): PlayerSeason[] {
  const filtered = players.filter(
    (p) =>
      canPickPlayer(sport, p.era, usedEras) &&
      openSlotLabels.some((slot) => canPlaceAtPosition(p.positions, slot)),
  );
  return sortPoolPlayers(sport, filtered);
}

export function getOpenSlotKeys(
  positions: string[],
  lineup: Map<string, PlayerSeason>,
): { key: string; label: string }[] {
  const seen = new Map<string, number>();
  const open: { key: string; label: string }[] = [];
  for (const pos of positions) {
    const idx = seen.get(pos) ?? 0;
    seen.set(pos, idx + 1);
    const key = `${pos}:${idx}`;
    if (!lineup.has(key)) {
      open.push({ key, label: pos });
    }
  }
  return open;
}

/** ponytail: assert self-check — run via `npx tsx src/lib/game/validation.ts` */
export function runValidationSelfCheck(): void {
  console.assert(
    matchesPositionFilter(["GK"], "GK") &&
      matchesPositionFilter(["CB", "LB"], "DEF") &&
      matchesPositionFilter(["CM", "AM"], "MID") &&
      matchesPositionFilter(["ST", "LW"], "FWD") &&
      !matchesPositionFilter(["GK"], "FWD"),
    "football position filters",
  );
  console.assert(
    matchesPositionFilter(["PG"], "G") && matchesPositionFilter(["C"], "C"),
    "basketball filters unchanged",
  );
  console.assert(
    poolPositionFilters("football").join(",") === "all,GK,DEF,MID,FWD",
    "football filter list",
  );
  console.assert(
    poolPositionFilters("basketball").join(",") === "all,G,F,C",
    "basketball filter list",
  );
}

if (typeof require !== "undefined" && require.main === module) {
  runValidationSelfCheck();
  console.log("validation self-check ok");
}
