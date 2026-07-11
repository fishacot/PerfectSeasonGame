import type { Era, PlayerSeason, SpinResult, SportId } from "@/lib/types";
import { basketballPoolSortScore } from "@/lib/simulation/basketball/engine";
import { ERA_RULES } from "@/lib/config/eras";
import { filterPickablePlayers } from "@/lib/game/validation";
import {
  createRng,
  filterAvailableEras,
  pickRandom,
} from "@/lib/game/era-pool";

export function spinTeamEra(
  sport: SportId,
  clubs: string[],
  eras: readonly Era[],
  usedEras: Era[],
  rng: () => number = Math.random,
): SpinResult {
  const rules = ERA_RULES[sport];
  const maxPer = rules.maxPerEra;

  const availableEras =
    usedEras.length > 0 && maxPer === 1
      ? filterAvailableEras(eras, usedEras, maxPer)
      : [...eras];

  const eraPool = availableEras.length > 0 ? availableEras : [...eras];
  return {
    club: pickRandom(clubs, rng),
    era: pickRandom(eraPool, rng),
  };
}

export function getPlayersForSpin(
  sport: SportId,
  players: PlayerSeason[],
  spin: SpinResult,
  pickedIds: Set<string>,
): PlayerSeason[] {
  return players
    .filter(
      (p) =>
        p.club === spin.club &&
        p.era === spin.era &&
        !pickedIds.has(p.id),
    )
    .sort((a, b) => {
      if (sport === "basketball") {
        const sb = basketballPoolSortScore(b);
        const sa = basketballPoolSortScore(a);
        if (sb !== sa) return sb - sa;
        return a.name.localeCompare(b.name);
      }
      // football / hockey: raw OVR desc (38-0 parity)
      if (b.rating !== a.rating) return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });
}

/** 38-0 pools are thin (2–14); basketball needs BBR franchise depth */
const MIN_POOL_BY_SPORT: Partial<Record<SportId, number>> = {
  basketball: 52,
  football: 2,
};
const DEFAULT_MIN_POOL = 6;
const MAX_SPIN_ATTEMPTS = 64;

function minPoolFor(sport: SportId): number {
  return MIN_POOL_BY_SPORT[sport] ?? DEFAULT_MIN_POOL;
}

function poolPasses(
  sport: SportId,
  players: PlayerSeason[],
  spin: SpinResult,
  pickedIds: Set<string>,
  usedEras: Era[],
  openSlotLabels: string[],
): boolean {
  if (getPlayersForSpin(sport, players, spin, pickedIds).length < minPoolFor(sport)) {
    return false;
  }
  if (openSlotLabels.length === 0) return true;
  const pool = getPlayersForSpin(sport, players, spin, pickedIds);
  return filterPickablePlayers(sport, pool, usedEras, openSlotLabels).length >= 1;
}

/** Prefer any club×era that still has a pickable pool over a blind random spin. */
function findAnyValidSpin(
  sport: SportId,
  clubs: string[],
  eras: readonly Era[],
  usedEras: Era[],
  players: PlayerSeason[],
  pickedIds: Set<string>,
  openSlotLabels: string[],
  rng: () => number,
): SpinResult | null {
  const shuffledClubs = [...clubs].sort(() => rng() - 0.5);
  const shuffledEras = [...eras].sort(() => rng() - 0.5);
  for (const club of shuffledClubs) {
    for (const era of shuffledEras) {
      const spin = { club, era };
      if (poolPasses(sport, players, spin, pickedIds, usedEras, openSlotLabels)) {
        return spin;
      }
    }
  }
  return null;
}

/** ponytail: re-roll club+era when seed data has no real pool for that combo */
export function spinTeamEraWithPool(
  sport: SportId,
  clubs: string[],
  eras: readonly Era[],
  usedEras: Era[],
  players: PlayerSeason[],
  pickedIds: Set<string>,
  openSlotLabels: string[] = [],
  rng: () => number = Math.random,
): SpinResult {
  for (let i = 0; i < MAX_SPIN_ATTEMPTS; i++) {
    const spin = spinTeamEra(sport, clubs, eras, usedEras, rng);
    if (poolPasses(sport, players, spin, pickedIds, usedEras, openSlotLabels)) {
      return spin;
    }
  }
  // Never blind-fallback to an empty franchise×era (e.g. Magic×1970s).
  const found = findAnyValidSpin(
    sport,
    clubs,
    eras,
    usedEras,
    players,
    pickedIds,
    openSlotLabels,
    rng,
  );
  if (found) return found;
  const shuffledClubs = [...clubs].sort(() => rng() - 0.5);
  const shuffledEras = [...eras].sort(() => rng() - 0.5);
  for (const club of shuffledClubs) {
    for (const era of shuffledEras) {
      if (getPlayersForSpin(sport, players, { club, era }, pickedIds).length > 0) {
        return { club, era };
      }
    }
  }
  return spinTeamEra(sport, clubs, eras, usedEras, rng);
}

export function spinClubWithPool(
  sport: SportId,
  clubs: string[],
  era: Era,
  usedEras: Era[],
  players: PlayerSeason[],
  pickedIds: Set<string>,
  openSlotLabels: string[] = [],
  rng: () => number = Math.random,
): string {
  for (let i = 0; i < MAX_SPIN_ATTEMPTS; i++) {
    const club = pickRandom(clubs, rng);
    if (
      poolPasses(
        sport,
        players,
        { club, era },
        pickedIds,
        usedEras,
        openSlotLabels,
      )
    ) {
      return club;
    }
  }
  const shuffled = [...clubs].sort(() => rng() - 0.5);
  for (const club of shuffled) {
    if (
      poolPasses(
        sport,
        players,
        { club, era },
        pickedIds,
        usedEras,
        openSlotLabels,
      )
    ) {
      return club;
    }
  }
  // Prefer any non-empty franchise×era over a blind pick (Magic×1970s = 0).
  for (const club of shuffled) {
    if (getPlayersForSpin(sport, players, { club, era }, pickedIds).length > 0) {
      return club;
    }
  }
  return pickRandom(clubs, rng);
}

export function spinEraWithPool(
  sport: SportId,
  club: string,
  eras: readonly Era[],
  usedEras: Era[],
  players: PlayerSeason[],
  pickedIds: Set<string>,
  openSlotLabels: string[] = [],
  rng: () => number = Math.random,
): Era {
  const rules = ERA_RULES[sport];
  const maxPer = rules.maxPerEra;
  const availableEras =
    usedEras.length > 0 && maxPer === 1
      ? filterAvailableEras(eras, usedEras, maxPer)
      : [...eras];
  const eraPool = availableEras.length > 0 ? availableEras : [...eras];

  for (let i = 0; i < MAX_SPIN_ATTEMPTS; i++) {
    const era = pickRandom(eraPool, rng);
    if (
      poolPasses(
        sport,
        players,
        { club, era },
        pickedIds,
        usedEras,
        openSlotLabels,
      )
    ) {
      return era;
    }
  }
  const shuffled = [...eraPool].sort(() => rng() - 0.5);
  for (const era of shuffled) {
    if (
      poolPasses(
        sport,
        players,
        { club, era },
        pickedIds,
        usedEras,
        openSlotLabels,
      )
    ) {
      return era;
    }
  }
  for (const era of shuffled) {
    if (getPlayersForSpin(sport, players, { club, era }, pickedIds).length > 0) {
      return era;
    }
  }
  return pickRandom(eraPool, rng);
}

export function getMatchSpins(
  sport: SportId,
  seedSource: string,
  rosterSize: number,
  clubs: string[],
  eras: readonly Era[],
  allPlayers: PlayerSeason[],
  openPositions: string[],
): SpinResult[] {
  const seed = `${seedSource}:${sport}`
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = createRng(seed);
  const spins: SpinResult[] = [];
  const usedEras: Era[] = [];
  const picked = new Set<string>();

  for (let i = 0; i < rosterSize; i++) {
    const spin = spinTeamEraWithPool(
      sport,
      clubs,
      eras,
      usedEras,
      allPlayers,
      picked,
      openPositions,
      rng,
    );
    spins.push(spin);
    usedEras.push(spin.era);
    const pool = getPlayersForSpin(sport, allPlayers, spin, picked);
    if (pool.length > 0) picked.add(pool[0].id);
  }
  return spins;
}
