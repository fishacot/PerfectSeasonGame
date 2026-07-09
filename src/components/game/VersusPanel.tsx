"use client";

import { LineupBoard } from "@/components/game/LineupBoard";
import { SlotMachine } from "@/components/game/SlotMachine";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Era, PlayerSeason, SpinResult, SportId } from "@/lib/types";

interface VersusPanelProps {
  sport: SportId;
  dict: Dictionary;
  userLineup: Map<string, PlayerSeason>;
  opponentLineup: Map<string, PlayerSeason>;
  currentSpin: SpinResult | null;
  clubs: readonly string[];
  eras: readonly Era[];
  round: number;
  rosterSize: number;
  cpuSpinning: boolean;
  botReveal: { player: PlayerSeason; slotKey: string } | null;
  botThinking: boolean;
  positions?: string[];
  formationLabel?: string;
}

export function VersusPanel({
  sport,
  dict,
  userLineup,
  opponentLineup,
  currentSpin,
  clubs,
  eras,
  round,
  rosterSize,
  cpuSpinning,
  botReveal,
  botThinking,
  positions,
  formationLabel,
}: VersusPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sport">
            {dict.versusYou}
          </p>
          <p className="font-display text-2xl text-text">{userLineup.size}/{rosterSize}</p>
        </div>
        <div className="flex flex-col items-center px-2">
          <span className="font-display text-xl tracking-widest text-muted">VS</span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted">
            {dict.round} {round}/{rosterSize}
          </span>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-400">
            {dict.versusCpu}
          </p>
          <p className="font-display text-2xl text-text">{opponentLineup.size}/{rosterSize}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-sport">
            {dict.versusYourCourt}
          </p>
          <LineupBoard
            variant={sport}
            lineup={userLineup}
            positions={positions}
            formationLabel={formationLabel}
            compact={sport === "basketball"}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-red-400">
            {dict.versusCpuCourt}
          </p>
          <LineupBoard
            variant={sport}
            lineup={opponentLineup}
            positions={positions}
            formationLabel={formationLabel}
            compact={sport === "basketball"}
          />
          <div className="scale-90 origin-top">
            <SlotMachine
              club={currentSpin?.club ?? null}
              era={currentSpin?.era ?? null}
              clubs={clubs}
              eras={eras}
              isSpinning={false}
              spinningClub={cpuSpinning}
              spinningEra={cpuSpinning}
              onSpin={() => {}}
              spinLabel=""
              disabled
              hideButton
            />
          </div>
        </div>
      </div>

      {(botThinking || botReveal) && (
        <div
          className={`rounded-xl border px-4 py-3 text-center transition-all ${
            botReveal
              ? "border-red-400/40 bg-red-500/10"
              : "border-white/10 bg-white/5 animate-pulse"
          }`}
        >
          {botThinking && !botReveal ? (
            <p className="text-xs font-bold uppercase tracking-widest text-muted">
              {dict.versusCpuThinking}
            </p>
          ) : botReveal ? (
            <p className="text-sm font-bold text-text">
              <span className="uppercase tracking-widest text-red-400">{dict.versusCpu}</span>
              {" · "}
              {botReveal.player.name}
              <span className="text-muted"> → {botReveal.slotKey.split(":")[0]}</span>
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
