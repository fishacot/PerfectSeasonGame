import type { PlayerSeason } from "@/lib/types";
import { adjustRating } from "@/lib/simulation/era-adjust";
import {
  createRng,
  hashSeed,
  pickWeighted,
  samplePoisson,
} from "@/lib/simulation/match/rng";

export interface FootballPlayerBox {
  playerId: string;
  name: string;
  position: string;
  minutes: number;
  goals: number;
  assists: number;
  shots: number;
  shotsOnTarget: number;
  keyPasses: number;
  tackles: number;
  interceptions: number;
  clearances: number;
  saves: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
  rating: number;
}

export interface FootballTeamBox {
  label: string;
  score: number;
  xg: number;
  possession: number;
  shots: number;
  shotsOnTarget: number;
  corners: number;
  fouls: number;
  players: FootballPlayerBox[];
}

export interface FootballMatchResult {
  sport: "football";
  seed: number;
  home: FootballTeamBox;
  away: FootballTeamBox;
  winner: "home" | "away" | "draw";
  events: { minute: number; type: "goal" | "own_goal"; team: "home" | "away"; playerId: string; playerName: string; assistId?: string; assistName?: string }[];
}

function isGk(p: PlayerSeason): boolean {
  return p.positions.includes("GK");
}

function isDef(p: PlayerSeason): boolean {
  return p.positions.some((pos) => ["LB", "CB", "RB", "DF", "LWB", "RWB"].includes(pos));
}

function isMid(p: PlayerSeason): boolean {
  return p.positions.some((pos) =>
    ["CM", "MF", "DM", "AM", "LM", "RM", "CDM", "CAM"].includes(pos),
  );
}

function isAtt(p: PlayerSeason): boolean {
  return p.positions.some((pos) =>
    ["LW", "RW", "ST", "FW", "CF", "SS"].includes(pos),
  );
}

function attackPower(lineup: PlayerSeason[]): number {
  let sum = 0;
  for (const p of lineup) {
    const g = p.stats.goals ?? p.stats.g ?? 0;
    const a = p.stats.assists ?? p.stats.a ?? 0;
    const r = adjustRating("football", p.era, p.rating);
    const role = isAtt(p) ? 1.25 : isMid(p) ? 1 : isGk(p) ? 0.15 : 0.55;
    sum += (g * 2.2 + a * 1.4 + r * 0.08) * role;
  }
  return sum / Math.max(1, lineup.length);
}

function defensePower(lineup: PlayerSeason[]): number {
  let sum = 0;
  for (const p of lineup) {
    // ponytail: football seeds often lack CS — lean on era-adjusted rating + role
    const cs = p.stats.cs ?? p.stats.cleanSheets ?? 0;
    const r = adjustRating("football", p.era, p.rating);
    const role = isGk(p) ? 1.4 : isDef(p) ? 1.2 : isMid(p) ? 0.7 : 0.35;
    sum += (cs * 1.5 + r * 0.12) * role;
  }
  return sum / Math.max(1, lineup.length);
}

function emptyPlayer(p: PlayerSeason, position: string, minutes: number): FootballPlayerBox {
  return {
    playerId: p.id,
    name: p.name,
    position,
    minutes,
    goals: 0,
    assists: 0,
    shots: 0,
    shotsOnTarget: 0,
    keyPasses: 0,
    tackles: 0,
    interceptions: 0,
    clearances: 0,
    saves: 0,
    fouls: 0,
    yellowCards: 0,
    redCards: 0,
    rating: 6.5,
  };
}

function minutesFor(lineup: PlayerSeason[], rng: () => number): number[] {
  return lineup.map((p) => {
    if (isGk(p)) return 90;
    return Math.round(68 + rng() * 22);
  });
}

/**
 * Football match via dual Poisson xG + credit assignment to players.
 * λ from attack vs opposing defense; box score derived from season G/A/CS + rating.
 */
export function simulateFootballMatch(
  homeLineup: PlayerSeason[],
  awayLineup: PlayerSeason[],
  options?: {
    homeSlots?: string[];
    awaySlots?: string[];
    homeLabel?: string;
    awayLabel?: string;
    seed?: number;
  },
): FootballMatchResult {
  if (homeLineup.length !== 11 || awayLineup.length !== 11) {
    throw new Error("Football match requires 11v11 lineups");
  }

  const seed =
    options?.seed ??
    hashSeed([
      ...homeLineup.map((p) => p.id),
      "|",
      ...awayLineup.map((p) => p.id),
    ]);
  const rng = createRng(seed);

  const homeAtt = attackPower(homeLineup);
  const awayAtt = attackPower(awayLineup);
  const homeDef = defensePower(homeLineup);
  const awayDef = defensePower(awayLineup);

  // League-average ~1.35 goals; scale by attack/defense ratio
  const homeXg = Math.max(0.2, Math.min(4.2, 1.35 * (homeAtt / Math.max(0.4, awayDef * 0.85 + 4))));
  const awayXg = Math.max(0.2, Math.min(4.2, 1.35 * (awayAtt / Math.max(0.4, homeDef * 0.85 + 4))));

  const homeGoals = samplePoisson(rng, homeXg);
  const awayGoals = samplePoisson(rng, awayXg);

  const homeSlots = options?.homeSlots ?? homeLineup.map((p) => p.positions[0] ?? "MF");
  const awaySlots = options?.awaySlots ?? awayLineup.map((p) => p.positions[0] ?? "MF");
  const homeMin = minutesFor(homeLineup, rng);
  const awayMin = minutesFor(awayLineup, rng);

  const homeBox = homeLineup.map((p, i) => emptyPlayer(p, homeSlots[i]!, homeMin[i]!));
  const awayBox = awayLineup.map((p, i) => emptyPlayer(p, awaySlots[i]!, awayMin[i]!));

  const events: FootballMatchResult["events"] = [];

  const creditGoals = (
    team: "home" | "away",
    lineup: PlayerSeason[],
    box: FootballPlayerBox[],
    goals: number,
  ) => {
    const weights = lineup.map((p) => {
      const g = p.stats.goals ?? p.stats.g ?? 0;
      const r = adjustRating("football", p.era, p.rating);
      if (isGk(p)) return 0.02;
      if (isAtt(p)) return g * 3 + r * 0.15 + 2;
      if (isMid(p)) return g * 2 + r * 0.1 + 1;
      return g * 1.2 + r * 0.05 + 0.4;
    });
    const assistWeights = lineup.map((p) => {
      const a = p.stats.assists ?? p.stats.a ?? 0;
      const r = adjustRating("football", p.era, p.rating);
      if (isGk(p)) return 0.05;
      return a * 3 + r * 0.08 + (isMid(p) ? 1.5 : isAtt(p) ? 1.2 : 0.5);
    });

    for (let g = 0; g < goals; g++) {
      const scorer = pickWeighted(rng, weights);
      box[scorer]!.goals += 1;
      box[scorer]!.shots += 1 + Math.floor(rng() * 2);
      box[scorer]!.shotsOnTarget += 1;
      let assistId: string | undefined;
      let assistName: string | undefined;
      if (rng() < 0.68) {
        const aw = assistWeights.map((w, i) => (i === scorer ? 0 : w));
        const asst = pickWeighted(rng, aw);
        box[asst]!.assists += 1;
        box[asst]!.keyPasses += 1;
        assistId = lineup[asst]!.id;
        assistName = lineup[asst]!.name;
      }
      const minute = Math.min(90, 1 + Math.floor(rng() * 90));
      events.push({
        minute,
        type: "goal",
        team,
        playerId: lineup[scorer]!.id,
        playerName: lineup[scorer]!.name,
        assistId,
        assistName,
      });
    }
  };

  creditGoals("home", homeLineup, homeBox, homeGoals);
  creditGoals("away", awayLineup, awayBox, awayGoals);
  events.sort((a, b) => a.minute - b.minute);

  const fillTeamStats = (
    lineup: PlayerSeason[],
    box: FootballPlayerBox[],
    xg: number,
    conceded: number,
    isHome: boolean,
  ) => {
    let shots = 0;
    let sot = 0;
    for (let i = 0; i < lineup.length; i++) {
      const p = lineup[i]!;
      const b = box[i]!;
      const r = adjustRating("football", p.era, p.rating);
      const g = p.stats.goals ?? p.stats.g ?? 0;
      const a = p.stats.assists ?? p.stats.a ?? 0;

      if (!isGk(p)) {
        const extraShots = Math.round((g * 0.9 + r * 0.04) * (b.minutes / 90) * (0.6 + rng()));
        b.shots += extraShots;
        b.shotsOnTarget += Math.min(b.shots, Math.round(extraShots * (0.3 + rng() * 0.25)));
        b.keyPasses += Math.round((a * 1.1 + r * 0.03) * (b.minutes / 90) * (0.5 + rng()));
      }

      if (isDef(p) || isMid(p)) {
        b.tackles += Math.round((1.2 + r * 0.04) * (b.minutes / 90) * (0.7 + rng()));
        b.interceptions += Math.round((0.8 + r * 0.03) * (b.minutes / 90) * (0.7 + rng()));
      }
      if (isDef(p)) {
        b.clearances += Math.round((2 + r * 0.05) * (b.minutes / 90) * (0.7 + rng()));
      }
      if (isGk(p)) {
        b.saves += Math.max(0, Math.round(conceded * (1.2 + rng()) + xg * 0.8));
      }

      b.fouls += Math.round(rng() * 2 * (b.minutes / 90));
      if (rng() < 0.12) b.yellowCards = 1;
      if (rng() < 0.015) b.redCards = 1;

      // Match rating 5.5–9.5
      let mr = 6.4 + (r - 80) * 0.02 + b.goals * 0.7 + b.assists * 0.45;
      if (isGk(p) && conceded === 0) mr += 0.8;
      if (isGk(p)) mr += b.saves * 0.08;
      mr += b.tackles * 0.05 + b.keyPasses * 0.04;
      mr -= b.fouls * 0.08 + b.yellowCards * 0.25 + b.redCards * 1.2;
      b.rating = Math.round(Math.min(9.7, Math.max(5.2, mr)) * 10) / 10;

      shots += b.shots;
      sot += b.shotsOnTarget;
    }
    const possession = isHome
      ? Math.round(42 + (homeAtt / (homeAtt + awayAtt)) * 16)
      : Math.round(100 - (42 + (homeAtt / (homeAtt + awayAtt)) * 16));
    return {
      shots,
      shotsOnTarget: sot,
      possession: Math.min(68, Math.max(32, possession)),
      corners: Math.round(3 + xg * 2 + rng() * 3),
      fouls: box.reduce((a, p) => a + p.fouls, 0),
    };
  };

  const homeAgg = fillTeamStats(homeLineup, homeBox, homeXg, awayGoals, true);
  const awayAgg = fillTeamStats(awayLineup, awayBox, awayXg, homeGoals, false);

  let winner: FootballMatchResult["winner"] = "draw";
  if (homeGoals > awayGoals) winner = "home";
  else if (awayGoals > homeGoals) winner = "away";

  return {
    sport: "football",
    seed,
    home: {
      label: options?.homeLabel ?? "Home",
      score: homeGoals,
      xg: Math.round(homeXg * 100) / 100,
      possession: homeAgg.possession,
      shots: homeAgg.shots,
      shotsOnTarget: homeAgg.shotsOnTarget,
      corners: homeAgg.corners,
      fouls: homeAgg.fouls,
      players: homeBox,
    },
    away: {
      label: options?.awayLabel ?? "Away",
      score: awayGoals,
      xg: Math.round(awayXg * 100) / 100,
      possession: awayAgg.possession,
      shots: awayAgg.shots,
      shotsOnTarget: awayAgg.shotsOnTarget,
      corners: awayAgg.corners,
      fouls: awayAgg.fouls,
      players: awayBox,
    },
    winner,
    events,
  };
}
