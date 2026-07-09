"use client";

import { useEffect, useState } from "react";
import type { SportId } from "@/lib/types";

const KEY = "psh-daily-best";

interface DailyBest {
  sport: SportId;
  wins: number;
  at: number;
}

export function DailyLeaderboardStub({ sport }: { sport: SportId }) {
  const [best, setBest] = useState<DailyBest | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`${KEY}-${sport}`);
      if (raw) setBest(JSON.parse(raw) as DailyBest);
    } catch {
      /* ponytail: ignore */
    }
  }, [sport]);

  if (!best) return null;

  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
      Best daily today: {best.wins} wins
    </p>
  );
}

export function recordDailyBest(sport: SportId, wins: number): void {
  try {
    const entry: DailyBest = { sport, wins, at: Date.now() };
    localStorage.setItem(`${KEY}-${sport}`, JSON.stringify(entry));
  } catch {
    /* ponytail: ignore */
  }
}
