"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { EASE_SMOOTH } from "@/lib/game/spin-timing";
import type { Era, GameMode, PlayerSeason, SportId } from "@/lib/types";
import {
  getPlayerSlotStatus,
  matchesPositionFilter,
  poolPositionFilters,
  sortPoolPlayers,
  type PositionFilter,
} from "@/lib/game/validation";
import { PlayerCard } from "@/components/game/PlayerCard";
import { ClubEraBadge } from "@/components/game/ClubEraBadge";

const STAT_HEADER: Partial<Record<SportId, string[]>> = {
  basketball: ["PPG", "RPG", "APG", "SPG", "BPG"],
  football: ["G", "A", "CS", "OVR"],
};

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.028, delayChildren: 0.06 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: EASE_SMOOTH },
  },
};

interface PlayerPoolListProps {
  sport: SportId;
  players: PlayerSeason[];
  usedEras: Era[];
  openSlotLabels: string[];
  mode: GameMode;
  dict: Dictionary;
  club?: string;
  era?: Era;
  onPick: (player: PlayerSeason) => void;
}

export function PlayerPoolList({
  sport,
  players,
  usedEras,
  openSlotLabels,
  mode,
  dict,
  club,
  era,
  onPick,
}: PlayerPoolListProps) {
  const filters = poolPositionFilters(sport);
  const [filter, setFilter] = useState<PositionFilter>("all");
  const [search, setSearch] = useState("");
  const useRows = sport === "basketball" || sport === "football";
  const headerStats = STAT_HEADER[sport];

  const sorted = useMemo(() => sortPoolPlayers(sport, players), [sport, players]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sorted.filter((p) => {
      if (filter !== "all" && !matchesPositionFilter(p.positions, filter)) {
        return false;
      }
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [sorted, filter, search]);

  const pickableCount = useMemo(
    () =>
      players.filter(
        (p) =>
          getPlayerSlotStatus(sport, p, usedEras, openSlotLabels) === "pickable",
      ).length,
    [players, sport, usedEras, openSlotLabels],
  );

  const headerCols =
    sport === "football"
      ? "md:grid-cols-[3rem_minmax(0,1fr)_repeat(3,minmax(2rem,2.25rem))_minmax(2.5rem,3rem)]"
      : "md:grid-cols-[3rem_minmax(0,1fr)_repeat(5,minmax(2.25rem,2.5rem))]";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
                filter === f
                  ? "bg-sport text-bg"
                  : "border border-white/10 text-muted hover:border-sport/40 hover:text-text"
              }`}
              onClick={() => setFilter(f)}
            >
              {dict.positionFilters[f as keyof typeof dict.positionFilters]}
            </button>
          ))}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-sport">
          {players.length} {dict.playersAvailable}
        </span>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={dict.searchPlayers}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-text placeholder:text-muted/60 focus:border-sport/50 focus:outline-none"
      />

      {(club || era) && (
        <div className="sticky top-[var(--header-offset,3.75rem)] z-30 lower-third-enter flex flex-wrap items-center gap-3 rounded-xl border border-sport/25 bg-sport/15 px-3 py-2.5 backdrop-blur-md sm:static sm:z-auto">
          <ClubEraBadge club={club} era={era} />
          <span className="h-1 w-1 shrink-0 rounded-full bg-sport/40" />
          <span className="shrink-0 text-[11px] font-black uppercase tracking-widest text-sport">
            {pickableCount} {dict.pickable}
          </span>
        </div>
      )}

      {useRows && mode !== "blind" && headerStats && (
        <div
          className={`sticky top-0 z-20 hidden border-b border-white/10 bg-surface/95 px-3 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-muted/80 backdrop-blur-md md:grid ${headerCols} md:gap-2 rounded-t-xl`}
        >
          <span aria-hidden="true" />
          <span>{dict.playerColumn}</span>
          {headerStats.map((label) => (
            <span key={label} className="text-center">
              {label}
            </span>
          ))}
        </div>
      )}

      <motion.div
        className="broadcast-panel flex max-h-[70vh] flex-col gap-2 overflow-y-auto p-1.5 custom-scrollbar rounded-xl"
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-muted">
              {players.length === 0 ? dict.noPlayersFit : dict.noSearchResults}
            </p>
          </div>
        ) : (
          visible.map((p) => {
            const status = getPlayerSlotStatus(
              sport,
              p,
              usedEras,
              openSlotLabels,
            );
            const pickable = status === "pickable";
            return (
              <motion.div key={p.id} variants={rowVariants} layout="position">
                <PlayerCard
                  variant={useRows ? "row" : "card"}
                  player={p}
                  blind={mode === "blind"}
                  disabled={!pickable}
                  statsHidden={dict.statsHidden}
                  slotStatus={status}
                  slotStatusLabel={
                    status === "no_slot"
                      ? dict.noSlot
                      : status === "era_full"
                        ? dict.eraFull
                        : undefined
                  }
                  onSelect={pickable ? () => onPick(p) : undefined}
                />
              </motion.div>
            );
          })
        )}
      </motion.div>

      {pickableCount === 0 && players.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-200">
            {dict.noPlayersFit}
          </p>
        </div>
      )}
    </div>
  );
}
