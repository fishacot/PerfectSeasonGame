/**
 * Franchise crest metadata for the club spin reel.
 * Logos: ESPN team marks mirrored under /public/teams/nba (user-requested full logos).
 * ponytail: design prompt says no official league logos — spin reel overrides that; swap to
 * stylized marks or remove /public/teams/nba if legal wants them gone.
 */

import { NBA_CLUBS } from "@/lib/config/leagues/basketball";

export interface ClubCrest {
  abbr: string;
  primary: string;
  secondary: string;
  /** ESPN NBA team id — source for /public/teams/nba/{abbr}.png */
  espnId: number;
}

const NBA_CRESTS: Record<string, ClubCrest> = {
  "76ers": { abbr: "PHI", primary: "#006BB6", secondary: "#ED174C", espnId: 20 },
  Bucks: { abbr: "MIL", primary: "#00471B", secondary: "#EEE1C6", espnId: 15 },
  Bulls: { abbr: "CHI", primary: "#CE1141", secondary: "#000000", espnId: 4 },
  Cavaliers: { abbr: "CLE", primary: "#860038", secondary: "#FDBB30", espnId: 5 },
  Celtics: { abbr: "BOS", primary: "#007A33", secondary: "#BA9653", espnId: 2 },
  Clippers: { abbr: "LAC", primary: "#C8102E", secondary: "#1D428A", espnId: 12 },
  Grizzlies: { abbr: "MEM", primary: "#5D76A9", secondary: "#12173F", espnId: 29 },
  Hawks: { abbr: "ATL", primary: "#E03A3E", secondary: "#C1D32F", espnId: 1 },
  Heat: { abbr: "MIA", primary: "#98002E", secondary: "#F9A01B", espnId: 14 },
  Hornets: { abbr: "CHA", primary: "#1D1160", secondary: "#00788C", espnId: 30 },
  Jazz: { abbr: "UTA", primary: "#002B5C", secondary: "#00471B", espnId: 26 },
  Kings: { abbr: "SAC", primary: "#5A2D81", secondary: "#63727A", espnId: 23 },
  Knicks: { abbr: "NYK", primary: "#006BB6", secondary: "#F58426", espnId: 18 },
  Lakers: { abbr: "LAL", primary: "#552583", secondary: "#FDB927", espnId: 13 },
  Magic: { abbr: "ORL", primary: "#0077C0", secondary: "#C4CED4", espnId: 19 },
  Mavericks: { abbr: "DAL", primary: "#00538C", secondary: "#B8C4CA", espnId: 6 },
  Nets: { abbr: "BKN", primary: "#000000", secondary: "#FFFFFF", espnId: 17 },
  Nuggets: { abbr: "DEN", primary: "#0E2240", secondary: "#FEC524", espnId: 7 },
  Pacers: { abbr: "IND", primary: "#002D62", secondary: "#FDBB30", espnId: 11 },
  Pelicans: { abbr: "NOP", primary: "#0C2340", secondary: "#C8102E", espnId: 3 },
  Pistons: { abbr: "DET", primary: "#C8102E", secondary: "#1D42BA", espnId: 8 },
  Raptors: { abbr: "TOR", primary: "#CE1141", secondary: "#000000", espnId: 28 },
  Rockets: { abbr: "HOU", primary: "#CE1141", secondary: "#000000", espnId: 10 },
  Spurs: { abbr: "SAS", primary: "#C4CED4", secondary: "#000000", espnId: 24 },
  Suns: { abbr: "PHX", primary: "#1D1160", secondary: "#E56020", espnId: 21 },
  Thunder: { abbr: "OKC", primary: "#007AC1", secondary: "#EF3B24", espnId: 25 },
  Timberwolves: { abbr: "MIN", primary: "#0C2340", secondary: "#236192", espnId: 16 },
  "Trail Blazers": { abbr: "POR", primary: "#E03A3E", secondary: "#000000", espnId: 22 },
  Warriors: { abbr: "GSW", primary: "#1D428A", secondary: "#FFC72C", espnId: 9 },
  Wizards: { abbr: "WAS", primary: "#002B5C", secondary: "#E31837", espnId: 27 },
};

const FALLBACK: ClubCrest = {
  abbr: "NBA",
  primary: "#ff9100",
  secondary: "#1a1a1a",
  espnId: 0,
};

export function getClubCrest(club: string): ClubCrest {
  return NBA_CRESTS[club] ?? FALLBACK;
}

export function hasClubCrest(club: string): boolean {
  return club in NBA_CRESTS;
}

/** Local mirror of ESPN logo; CDN fallback if file missing at runtime. */
export function getClubLogoSrc(club: string): string | null {
  const crest = NBA_CRESTS[club];
  if (!crest) return null;
  return `/teams/nba/${crest.abbr.toLowerCase()}.png`;
}

export function getClubLogoCdnSrc(club: string): string | null {
  const crest = NBA_CRESTS[club];
  if (!crest?.espnId) return null;
  return `https://a.espncdn.com/i/teamlogos/nba/500/${crest.espnId}.png`;
}

// ponytail: run with `npx tsx src/lib/assets/club-crests.ts`
export function runClubCrestsSelfCheck(): void {
  console.assert(getClubCrest("Lakers").abbr === "LAL", "Lakers crest");
  console.assert(getClubCrest("Trail Blazers").espnId === 22, "Blazers espn id");
  console.assert(getClubLogoSrc("76ers") === "/teams/nba/phi.png", "76ers logo path");
  console.assert(getClubCrest("Unknown").abbr === "NBA", "fallback crest");
  for (const club of NBA_CLUBS) {
    console.assert(hasClubCrest(club), `missing crest: ${club}`);
    console.assert(getClubLogoSrc(club) != null, `missing logo src: ${club}`);
  }
}

if (typeof require !== "undefined" && require.main === module) {
  runClubCrestsSelfCheck();
  console.log("club-crests self-check ok");
}
