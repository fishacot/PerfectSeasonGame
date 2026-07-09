import type { SportId } from "@/lib/types";

export interface DailyAttempt {
  wins: number;
  losses: number;
  maxWins: number;
  botWins?: number;
  userWon?: boolean;
  at: number;
}

function todayKey(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function dailyStorageKey(sport: SportId, league?: string): string {
  return `psh-daily-${sport}-${league ?? "all"}-${todayKey()}`;
}

export function getDailyAttempt(
  sport: SportId,
  league?: string,
): DailyAttempt | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(dailyStorageKey(sport, league));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DailyAttempt;
  } catch {
    return null;
  }
}

export function saveDailyAttempt(
  sport: SportId,
  league: string | undefined,
  attempt: DailyAttempt,
): void {
  localStorage.setItem(
    dailyStorageKey(sport, league),
    JSON.stringify(attempt),
  );
}
