import type { Era, PlayerSeason } from "@/lib/types";
import { adjustedPlayerStats } from "@/lib/simulation/basketball/engine";
import { createRng, hashSeed, pickWeighted } from "@/lib/simulation/match/rng";

export interface BasketballPlayerBox {
  playerId: string;
  name: string;
  position: string;
  minutes: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  fgMade: number;
  fgAtt: number;
  threeMade: number;
  threeAtt: number;
  ftMade: number;
  ftAtt: number;
  plusMinus: number;
}

export interface BasketballTeamBox {
  label: string;
  score: number;
  players: BasketballPlayerBox[];
  totals: {
    pts: number;
    reb: number;
    ast: number;
    stl: number;
    blk: number;
    tov: number;
    fgMade: number;
    fgAtt: number;
    threeMade: number;
    threeAtt: number;
    ftMade: number;
    ftAtt: number;
  };
}

export interface BasketballMatchResult {
  sport: "basketball";
  seed: number;
  home: BasketballTeamBox;
  away: BasketballTeamBox;
  winner: "home" | "away" | "tie";
  quarters: { home: number; away: number }[];
}

/** 5 on floor × 48 min. No bench in sandbox → each starter logs 48. */
const TEAM_MINUTES = 240;

type Rates = {
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
};

type Side = {
  label: string;
  players: PlayerSeason[];
  slots: string[];
  rates: Rates[];
  offense: number;
  defense: number;
};

function buildSide(label: string, lineup: PlayerSeason[], slots: string[]): Side {
  const rates = lineup.map((p) => adjustedPlayerStats(p.era, p.stats));
  const offense =
    rates.reduce((a, r) => a + r.pts * 0.55 + r.ast * 0.25 + r.reb * 0.1, 0) /
    Math.max(1, lineup.length);
  const defense =
    rates.reduce((a, r) => a + r.stl * 0.4 + r.blk * 0.35 + r.reb * 0.25, 0) /
    Math.max(1, lineup.length);
  return { label, players: lineup, slots, rates, offense, defense };
}

/** No bench in sandbox → all five play the full 48. */
function allocateMinutes(_rng: () => number, _rates: Rates[]): number[] {
  const m = TEAM_MINUTES / 5;
  return [m, m, m, m, m];
}

/** Era + position three-point attempt share (0–1 of FGA that are 3s). */
function threeRate(era: Era, position: string, pts: number): number {
  const eraFloor: Record<Era, number> = {
    "1950s": 0,
    "1960s": 0,
    "1970s": 0.02,
    "1980s": 0.08,
    "1990s": 0.16,
    "2000s": 0.22,
    "2010s": 0.32,
    "2020s": 0.38,
  };
  const posMult =
    position === "PG" || position === "SG"
      ? 1.15
      : position === "SF"
        ? 1
        : position === "PF"
          ? 0.55
          : 0.2; // C
  const base = (eraFloor[era] ?? 0.2) * posMult;
  // High scorers slightly more volume, but centers stay low
  return Math.min(0.48, Math.max(0, base + (pts > 22 ? 0.04 : 0)));
}

function emptyBox(
  p: PlayerSeason,
  position: string,
  minutes: number,
): BasketballPlayerBox {
  return {
    playerId: p.id,
    name: p.name,
    position,
    minutes,
    pts: 0,
    reb: 0,
    ast: 0,
    stl: 0,
    blk: 0,
    tov: 0,
    fgMade: 0,
    fgAtt: 0,
    threeMade: 0,
    threeAtt: 0,
    ftMade: 0,
    ftAtt: 0,
    plusMinus: 0,
  };
}

function teamTotals(players: BasketballPlayerBox[]): BasketballTeamBox["totals"] {
  return players.reduce(
    (t, p) => ({
      pts: t.pts + p.pts,
      reb: t.reb + p.reb,
      ast: t.ast + p.ast,
      stl: t.stl + p.stl,
      blk: t.blk + p.blk,
      tov: t.tov + p.tov,
      fgMade: t.fgMade + p.fgMade,
      fgAtt: t.fgAtt + p.fgAtt,
      threeMade: t.threeMade + p.threeMade,
      threeAtt: t.threeAtt + p.threeAtt,
      ftMade: t.ftMade + p.ftMade,
      ftAtt: t.ftAtt + p.ftAtt,
    }),
    {
      pts: 0,
      reb: 0,
      ast: 0,
      stl: 0,
      blk: 0,
      tov: 0,
      fgMade: 0,
      fgAtt: 0,
      threeMade: 0,
      threeAtt: 0,
      ftMade: 0,
      ftAtt: 0,
    },
  );
}

/**
 * Possession-level basketball match (5v5 sandbox, no bench).
 * Rebounds only from live misses; 3PT rate by era×position; minutes sum to 240.
 */
export function simulateBasketballMatch(
  homeLineup: PlayerSeason[],
  awayLineup: PlayerSeason[],
  options?: {
    homeSlots?: string[];
    awaySlots?: string[];
    homeLabel?: string;
    awayLabel?: string;
    seed?: number;
  },
): BasketballMatchResult {
  if (homeLineup.length !== 5 || awayLineup.length !== 5) {
    throw new Error("Basketball match requires 5v5 lineups");
  }

  const seed =
    options?.seed ??
    hashSeed([
      ...homeLineup.map((p) => p.id),
      "|",
      ...awayLineup.map((p) => p.id),
    ]);
  const rng = createRng(seed);

  const home = buildSide(
    options?.homeLabel ?? "Home",
    homeLineup,
    options?.homeSlots ?? ["PG", "SG", "SF", "PF", "C"],
  );
  const away = buildSide(
    options?.awayLabel ?? "Away",
    awayLineup,
    options?.awaySlots ?? ["PG", "SG", "SF", "PF", "C"],
  );

  const homeMin = allocateMinutes(rng, home.rates);
  const awayMin = allocateMinutes(rng, away.rates);
  const homeBox = home.players.map((p, i) =>
    emptyBox(p, home.slots[i] ?? p.positions[0] ?? "F", homeMin[i]!),
  );
  const awayBox = away.players.map((p, i) =>
    emptyBox(p, away.slots[i] ?? p.positions[0] ?? "F", awayMin[i]!),
  );

  // ~98–104 possessions per team
  const pace = 98 + rng() * 6;
  const possessions = Math.round(pace * 2);
  const quarters = [
    { home: 0, away: 0 },
    { home: 0, away: 0 },
    { home: 0, away: 0 },
    { home: 0, away: 0 },
  ];

  const homeOffMult = Math.min(
    1.25,
    Math.max(0.8, home.offense / Math.max(8, away.defense * 3.5 + 6)),
  );
  const awayOffMult = Math.min(
    1.25,
    Math.max(0.8, away.offense / Math.max(8, home.defense * 3.5 + 6)),
  );

  for (let poss = 0; poss < possessions; poss++) {
    const q = Math.min(3, Math.floor((poss / possessions) * 4));
    const homeHasBall = poss % 2 === 0 ? rng() < 0.52 : rng() < 0.48;
    const offense = homeHasBall ? home : away;
    const offBox = homeHasBall ? homeBox : awayBox;
    const defBox = homeHasBall ? awayBox : homeBox;
    const defSide = homeHasBall ? away : home;
    const offMult = homeHasBall ? homeOffMult : awayOffMult;

    const minW = (i: number) => Math.max(0.2, offBox[i]!.minutes / 36);
    const defMinW = (i: number) => Math.max(0.2, defBox[i]!.minutes / 36);

    const shooter = pickWeighted(
      rng,
      offense.rates.map((r, i) => r.pts * minW(i)),
    );
    const passer = pickWeighted(
      rng,
      offense.rates.map((r, i) => (i === shooter ? 0.04 : r.ast * minW(i))),
    );
    const rebounder = pickWeighted(
      rng,
      defSide.rates.map((r, i) => r.reb * defMinW(i)),
    );
    const stealer = pickWeighted(
      rng,
      defSide.rates.map((r, i) => r.stl * defMinW(i)),
    );
    const blocker = pickWeighted(
      rng,
      defSide.rates.map((r, i) => r.blk * defMinW(i)),
    );

    const toRate = Math.min(0.13, 0.07 + (1.05 - offMult) * 0.04);
    const foulRate = 0.1;
    const roll = rng();

    if (roll < toRate) {
      offBox[shooter]!.tov += 1;
      if (rng() < 0.5) defBox[stealer]!.stl += 1;
      continue;
    }

    if (roll < toRate + foulRate) {
      const fta = rng() < 0.22 ? 3 : 2;
      offBox[shooter]!.ftAtt += fta;
      let made = 0;
      const ftPct = Math.min(0.9, 0.7 + offense.rates[shooter]!.pts / 120);
      for (let i = 0; i < fta; i++) {
        if (rng() < ftPct) {
          made++;
          offBox[shooter]!.pts += 1;
        }
      }
      offBox[shooter]!.ftMade += made;
      if (homeHasBall) quarters[q]!.home += made;
      else quarters[q]!.away += made;
      continue;
    }

    const pos = offBox[shooter]!.position;
    const era = offense.players[shooter]!.era;
    const isThree =
      rng() < threeRate(era, pos, offense.rates[shooter]!.pts);

    const blockChance = Math.min(
      0.07,
      defSide.rates[blocker]!.blk / 35,
    );
    if (rng() < blockChance) {
      defBox[blocker]!.blk += 1;
      offBox[shooter]!.fgAtt += 1;
      if (isThree) offBox[shooter]!.threeAtt += 1;
      defBox[rebounder]!.reb += 1;
      continue;
    }

    const fgPct = Math.min(
      0.56,
      0.43 + (offMult - 1) * 0.08 + offense.rates[shooter]!.pts / 160,
    );
    const threePct = Math.min(
      0.4,
      0.32 + (offMult - 1) * 0.05 + offense.rates[shooter]!.pts / 200,
    );
    const make = rng() < (isThree ? threePct : fgPct);

    offBox[shooter]!.fgAtt += 1;
    if (isThree) offBox[shooter]!.threeAtt += 1;

    if (make) {
      const pts = isThree ? 3 : 2;
      offBox[shooter]!.fgMade += 1;
      if (isThree) offBox[shooter]!.threeMade += 1;
      offBox[shooter]!.pts += pts;
      if (passer !== shooter && rng() < 0.58) offBox[passer]!.ast += 1;
      if (homeHasBall) quarters[q]!.home += pts;
      else quarters[q]!.away += pts;
    } else {
      // Live rebound only — no post-hoc RPG inflation
      if (rng() < 0.26) {
        const orb = pickWeighted(
          rng,
          offense.rates.map((r, i) => r.reb * minW(i)),
        );
        offBox[orb]!.reb += 1;
      } else {
        defBox[rebounder]!.reb += 1;
      }
    }
  }

  // Light steal/block fill only if possession loop under-produced (cap to season-ish)
  const fillPeripheral = (box: BasketballPlayerBox[], rates: Rates[]) => {
    for (let i = 0; i < 5; i++) {
      const share = box[i]!.minutes / 48;
      const targetStl = Math.round(rates[i]!.stl * share * (0.85 + rng() * 0.3));
      const targetBlk = Math.round(rates[i]!.blk * share * (0.85 + rng() * 0.3));
      if (box[i]!.stl < targetStl) {
        box[i]!.stl = Math.min(targetStl, box[i]!.stl + Math.round(rng() * 2));
      }
      if (box[i]!.blk < targetBlk) {
        box[i]!.blk = Math.min(targetBlk, box[i]!.blk + Math.round(rng() * 2));
      }
      // Soft TO floor from minutes (already have some from loop)
      const toFloor = Math.round(1.4 * share + rng());
      if (box[i]!.tov < toFloor) box[i]!.tov = toFloor;
    }
  };
  fillPeripheral(homeBox, home.rates);
  fillPeripheral(awayBox, away.rates);

  // Cap absurd individual rebounds (sandbox 5-man still shouldn't look like 36)
  for (const p of [...homeBox, ...awayBox]) {
    const softCap = 8 + p.minutes * 0.22; // ~16–17 max for 42 min big
    if (p.reb > softCap) p.reb = Math.round(softCap);
  }

  let homeScore = quarters.reduce((a, q) => a + q.home, 0);
  let awayScore = quarters.reduce((a, q) => a + q.away, 0);

  // Sync pts to quarter totals if drift
  const syncPts = (box: BasketballPlayerBox[], target: number) => {
    const sum = box.reduce((a, p) => a + p.pts, 0);
    const d = target - sum;
    if (d !== 0) {
      const scorer = box.reduce((best, p, i) =>
        p.pts >= box[best]!.pts ? i : best,
      0);
      box[scorer]!.pts += d;
      if (d > 0) {
        box[scorer]!.ftAtt += d;
        box[scorer]!.ftMade += d;
      }
    }
  };
  syncPts(homeBox, homeScore);
  syncPts(awayBox, awayScore);

  let winner: BasketballMatchResult["winner"] = "tie";
  if (homeScore > awayScore) winner = "home";
  else if (awayScore > homeScore) winner = "away";

  if (winner === "tie") {
    const otHome = Math.round(8 + rng() * 8);
    const otAway = Math.round(8 + rng() * 8);
    let h = otHome;
    let a = otAway;
    if (h === a) h += 1;
    quarters.push({ home: h, away: a });
    homeBox[0]!.pts += h;
    awayBox[0]!.pts += a;
    homeScore += h;
    awayScore += a;
    winner = h > a ? "home" : "away";
  }

  const margin = homeScore - awayScore;
  // ponytail: no bench → same on-court unit; +/- still team margin (honest for 5-man)
  for (const p of homeBox) p.plusMinus = margin;
  for (const p of awayBox) p.plusMinus = -margin;

  return {
    sport: "basketball",
    seed,
    home: {
      label: home.label,
      score: homeScore,
      players: homeBox,
      totals: teamTotals(homeBox),
    },
    away: {
      label: away.label,
      score: awayScore,
      players: awayBox,
      totals: teamTotals(awayBox),
    },
    winner,
    quarters,
  };
}
