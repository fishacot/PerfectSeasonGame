import type { Era, FootballLeague, SportId, SpinResult } from "@/lib/types";

export interface ParsedChallenge {
  sport: SportId;
  league?: FootballLeague;
  spins: SpinResult[];
  wins?: number;
}

const SPORTS: SportId[] = ["football", "basketball", "hockey"];
const ERAS: Era[] = [
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
];

function isSpinResult(value: unknown): value is SpinResult {
  if (!value || typeof value !== "object") return false;
  const s = value as Record<string, unknown>;
  return typeof s.club === "string" && ERAS.includes(s.era as Era);
}

/** Encode challenge payload for share URL. */
export function encodeChallengePayload(data: Omit<ParsedChallenge, never>): string {
  const json = JSON.stringify(data);
  return typeof Buffer !== "undefined"
    ? Buffer.from(json, "utf8").toString("base64")
    : btoa(json);
}

/** ponytail: short id stored in localStorage; full payload in URL remains canonical */
const SHORT_PREFIX = "psh-c-";

export function storeShortChallenge(id: string, data: ParsedChallenge): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(`${SHORT_PREFIX}${id}`, JSON.stringify(data));
  } catch {
    /* ignore quota */
  }
}

export function loadShortChallenge(id: string): ParsedChallenge | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${SHORT_PREFIX}${id}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ParsedChallenge;
    if (!parsed?.sport || !parsed.spins?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function makeChallengeUrl(
  origin: string,
  path: string,
  data: ParsedChallenge,
): string {
  const encoded = encodeChallengePayload(data);
  const shortId = encoded.slice(0, 8).replace(/[+/=]/g, "x");
  storeShortChallenge(shortId, data);
  return `${origin}${path}?c=${shortId}&challenge=${encoded}`;
}

/** Decode ?challenge= base64 JSON from share link (browser or Node). */
export function parseChallengePayload(encoded: string): ParsedChallenge | null {
  try {
    const jsonStr =
      typeof Buffer !== "undefined"
        ? Buffer.from(encoded, "base64").toString("utf8")
        : atob(encoded);
    const raw = JSON.parse(jsonStr) as Record<string, unknown>;
    if (!SPORTS.includes(raw.sport as SportId)) return null;
    if (!Array.isArray(raw.spins) || raw.spins.length === 0) return null;
    if (!raw.spins.every(isSpinResult)) return null;
    const wins =
      typeof raw.wins === "number" && Number.isFinite(raw.wins)
        ? raw.wins
        : undefined;
    return {
      sport: raw.sport as SportId,
      league: raw.league as FootballLeague | undefined,
      spins: raw.spins as SpinResult[],
      wins,
    };
  } catch {
    return null;
  }
}

// ponytail: run with `npx tsx src/lib/game/challenge.ts`
if (typeof require !== "undefined" && require.main === module) {
  const sample = Buffer.from(
    JSON.stringify({
      sport: "basketball",
      spins: [{ club: "Lakers", era: "1980s" }],
      wins: 72,
    }),
  ).toString("base64");
  const parsed = parseChallengePayload(sample);
  console.assert(parsed?.sport === "basketball" && parsed.wins === 72, "challenge parse ok");
  console.assert(parseChallengePayload("!!!") === null, "invalid rejected");
  console.log("challenge self-check ok");
}
