"use client";

import { RotateCcw } from "lucide-react";
import type { SportId } from "@/lib/types";

interface SkipChipsProps {
  sport: SportId;
  rerollsRemaining: number;
  skipsUsed: { team: boolean; era: boolean };
  onSkipTeam: () => void;
  onSkipEra: () => void;
  skipTeamLabel: string;
  skipEraLabel: string;
  rerollsLabel?: string;
  disabled?: boolean;
}

export function SkipChips({
  skipsUsed,
  onSkipTeam,
  onSkipEra,
  skipTeamLabel,
  skipEraLabel,
  disabled = false,
}: SkipChipsProps) {
  const teamExhausted = skipsUsed.team;
  const eraExhausted = skipsUsed.era;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onSkipTeam}
          disabled={disabled || teamExhausted}
          className={`group flex flex-1 items-center justify-center gap-3 rounded-lg border py-5 transition-colors duration-300 ${
            teamExhausted
              ? "border-white/5 bg-white/5 text-muted opacity-20"
              : "border-sport/20 bg-sport/5 text-text hover:border-sport hover:bg-sport/10 hover:glow-sport"
          } disabled:cursor-not-allowed`}
        >
          <RotateCcw className={`h-4 w-4 transition-transform group-hover:rotate-180 duration-500 ${teamExhausted ? "hidden" : "block"}`} />
          <span className="micro-label">
            {skipTeamLabel.toUpperCase()}
          </span>
        </button>

        <button
          type="button"
          onClick={onSkipEra}
          disabled={disabled || eraExhausted}
          className={`group flex flex-1 items-center justify-center gap-3 rounded-lg border py-5 transition-colors duration-300 ${
            eraExhausted
              ? "border-white/5 bg-white/5 text-muted opacity-20"
              : "border-sport/20 bg-sport/5 text-text hover:border-sport hover:bg-sport/10 hover:glow-sport"
          } disabled:cursor-not-allowed`}
        >
          <RotateCcw className={`h-4 w-4 transition-transform group-hover:rotate-180 duration-500 ${eraExhausted ? "hidden" : "block"}`} />
          <span className="micro-label">
            {skipEraLabel.toUpperCase()}
          </span>
        </button>
      </div>
    </div>
  );
}
