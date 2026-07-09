"use client";

import { motion } from "framer-motion";
import { LineupBoard } from "@/components/game/LineupBoard";
import { PlayerCard } from "@/components/game/PlayerCard";
import { EASE_SMOOTH } from "@/lib/game/spin-timing";
import { SPORTS } from "@/lib/config/sports";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { DraftPick, PlayerSeason, SportId } from "@/lib/types";

interface FinalRosterProps {
  sport: SportId;
  lineup: Map<string, PlayerSeason>;
  picks: DraftPick[];
  dict: Dictionary;
  formationLabel?: string;
  positions?: string[];
}

export function FinalRoster({
  sport,
  lineup,
  picks,
  dict,
  formationLabel,
  positions,
}: FinalRosterProps) {
  const roster =
    picks.length > 0
      ? picks.map((pick) => ({
          key: `${pick.slotPosition}-${pick.round}`,
          player: pick.player,
          slot: pick.slotPosition,
          round: pick.round,
        }))
      : Array.from(lineup.entries()).map(([slotKey, player]) => ({
          key: slotKey,
          player,
          slot: slotKey.split(":")[0] ?? slotKey,
          round: null as number | null,
        }));

  return (
    <motion.div
      className="flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/10 bg-surface/60 p-4 backdrop-blur-xl sm:p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_SMOOTH, delay: 0.15 }}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-xl tracking-wide text-text sm:text-2xl">
          {dict.finalRoster.toUpperCase()}
        </h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted">
          {roster.length} / {SPORTS[sport].rosterSize}
        </span>
      </div>

      <LineupBoard
        variant={sport}
        lineup={lineup}
        positions={positions}
        formationLabel={formationLabel}
        compact={sport === "basketball" || sport === "football"}
      />

      <div className="flex flex-col gap-2">
        {roster.map(({ key, player, slot, round }, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.32,
              ease: EASE_SMOOTH,
              delay: 0.08 * index,
            }}
          >
            <div className="mb-1 flex items-center gap-2 px-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-sport">
                {slot}
              </span>
              {round != null && (
                <>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                    {dict.round} {round}
                  </span>
                </>
              )}
            </div>
            <PlayerCard
              variant={sport === "basketball" || sport === "football" ? "row" : "card"}
              player={player}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
