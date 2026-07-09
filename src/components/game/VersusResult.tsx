"use client";

import type { SimulationResult, SportId } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { ResultBreakdown } from "@/components/game/ResultBreakdown";

interface VersusResultProps {
  sport: SportId;
  userResult: SimulationResult;
  botResult: SimulationResult;
  dict: Dictionary;
}

export function VersusResult({ sport, userResult, botResult, dict }: VersusResultProps) {
  const userWon = userResult.wins > botResult.wins;
  const tie = userResult.wins === botResult.wins;

  return (
    <div className="flex flex-col gap-6">
      <div
        className={`rounded-2xl border px-6 py-5 text-center ${
          tie
            ? "border-white/20 bg-white/5"
            : userWon
              ? "border-sport/40 bg-sport/10"
              : "border-red-500/40 bg-red-500/10"
        }`}
      >
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">
          {dict.versusOutcome}
        </p>
        <p className="mt-2 font-display text-4xl tracking-wide text-text">
          {tie
            ? dict.versusTie
            : userWon
              ? dict.versusYouWin
              : dict.versusCpuWin}
        </p>
        <p className="mt-2 text-sm text-muted">
          {dict.versusScoreLine
            .replace("{you}", String(userResult.wins))
            .replace("{cpu}", String(botResult.wins))}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-center text-[10px] font-black uppercase tracking-[0.2em] text-sport">
            {dict.versusYou}
          </p>
          <ResultBreakdown result={userResult} dict={dict} sport={sport} />
        </div>
        <div>
          <p className="mb-2 text-center text-[10px] font-black uppercase tracking-[0.2em] text-red-400">
            {dict.versusCpu}
          </p>
          <ResultBreakdown result={botResult} dict={dict} sport={sport} />
        </div>
      </div>
    </div>
  );
}
