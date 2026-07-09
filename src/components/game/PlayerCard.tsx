"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ERA_COLORS } from "@/lib/config/eras";
import { EASE_SMOOTH } from "@/lib/game/spin-timing";
import { getPlayerPhotoUrl, getSportFallbackPhoto } from "@/lib/assets/player-photos";
import type { PlayerSeason, SportId, Locale } from "@/lib/types";
import type { PlayerSlotStatus } from "@/lib/game/validation";
import { useSportTheme } from "@/components/SportThemeProvider";
import { useParams } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";

const STAT_LABELS: Record<SportId, Record<string, string>> = {
  football: { goals: "G", assists: "A", cleanSheets: "CS" },
  basketball: { ppg: "PPG", rpg: "RPG", apg: "APG", spg: "SPG", bpg: "BPG" },
  hockey: { goals: "G", assists: "A", savePct: "SV%" },
};

const BASKETBALL_STAT_KEYS = ["ppg", "rpg", "apg", "spg", "bpg"] as const;
const FOOTBALL_STAT_KEYS = ["goals", "assists", "cleanSheets"] as const;

function formatStatValue(key: string, value: number): string {
  if (key === "savePct") return `${(value * 100).toFixed(1)}%`;
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function playerStatEntries(sport: SportId, stats: Record<string, number>) {
  if (sport === "basketball") {
    return BASKETBALL_STAT_KEYS.map((key) => ({
      label: STAT_LABELS.basketball[key],
      value: formatStatValue(key, stats[key] ?? 0),
    }));
  }
  if (sport === "football") {
    return FOOTBALL_STAT_KEYS.map((key) => ({
      label: STAT_LABELS.football[key],
      value: formatStatValue(key, stats[key] ?? 0),
    }));
  }
  const labels = STAT_LABELS[sport];
  return Object.entries(stats)
    .filter(([key]) => key in labels)
    .map(([key, value]) => ({
      label: labels[key],
      value: formatStatValue(key, value ?? 0),
    }));
}

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

interface PlayerCardProps {
  player: PlayerSeason;
  variant?: "card" | "row";
  blind?: boolean;
  selected?: boolean;
  disabled?: boolean;
  slotStatus?: PlayerSlotStatus;
  slotStatusLabel?: string;
  onSelect?: () => void;
}

export function PlayerCard({
  player,
  variant = "card",
  blind = false,
  selected = false,
  disabled = false,
  slotStatusLabel,
  onSelect,
}: PlayerCardProps) {
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const dict = getDictionary(locale as Locale);
  const sport = useSportTheme();
  const eraColor = ERA_COLORS[player.era] ?? "#64748b";
  const showOvr = sport !== "basketball";
  const ratingPct = Math.min(100, Math.max(0, player.rating));
  const isHighRated = showOvr && player.rating >= 90;
  const statEntries = blind || !sport ? [] : playerStatEntries(sport, player.stats);
  const resolvedPhoto =
    sport && !blind
      ? getPlayerPhotoUrl(sport, player.name, blind) ?? getSportFallbackPhoto(sport)
      : null;
  const hasRealPhoto = sport
    ? Boolean(getPlayerPhotoUrl(sport, player.name, blind))
    : false;
  // Football: initials plate when no cutout. Basketball: keep sport _default.webp fallback.
  const showPhotoImage =
    Boolean(resolvedPhoto) && (sport !== "football" || hasRealPhoto);
  const photoUrl = resolvedPhoto;

  if (variant === "row" && (sport === "basketball" || sport === "football")) {
    const isFootball = sport === "football";
    const nameBlock = (
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-sm tracking-wide text-text">
          {player.name.toUpperCase()}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          {player.positions.map((pos) => (
            <span
              key={pos}
              className="text-[9px] font-black uppercase tracking-widest text-muted"
            >
              {pos}
            </span>
          ))}
          {slotStatusLabel && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400/90">
              · {slotStatusLabel}
            </span>
          )}
        </div>
      </div>
    );

    const photoEl = (
      <div
        className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/15 ${
          isFootball
            ? "bg-gradient-to-br from-[#143d1a] to-[#0a1f0e]"
            : "bg-black/40"
        }`}
      >
        {photoUrl && showPhotoImage ? (
          <Image
            src={photoUrl}
            alt=""
            fill
            className="object-cover object-top grayscale transition-all group-hover:grayscale-0"
            sizes="40px"
          />
        ) : (
          <span
            className={`flex h-full w-full items-center justify-center text-[10px] font-black ${
              isFootball ? "text-sport/80" : "text-muted"
            }`}
          >
            {initialsFromName(player.name)}
          </span>
        )}
      </div>
    );

    const statsMobile = blind ? (
      <span className="text-[9px] font-black uppercase tracking-widest text-sport/50 italic">
        {dict.statsHidden}
      </span>
    ) : (
      <div className={`grid gap-1 ${isFootball ? "grid-cols-4" : "grid-cols-5"}`}>
        {statEntries.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center rounded border border-white/5 bg-black/40 px-0.5 py-1.5 shadow-sm"
          >
            <span className="text-[8px] font-bold uppercase text-muted/80">{label}</span>
            <span className="font-display tabular-nums text-xs text-text">{value}</span>
          </div>
        ))}
        {isFootball && showOvr && (
          <div className="flex flex-col items-center rounded border border-white/5 bg-black/40 px-0.5 py-1.5 shadow-sm">
            <span className="text-[8px] font-bold uppercase text-muted/80">OVR</span>
            <span
              className={`font-display tabular-nums text-xs ${isHighRated ? "text-gold" : "text-sport"}`}
            >
              {player.rating}
            </span>
          </div>
        )}
      </div>
    );

    const gridCols = isFootball
      ? "md:grid-cols-[3rem_minmax(0,1fr)_repeat(3,minmax(2rem,2.25rem))_minmax(2.5rem,3rem)]"
      : "md:grid-cols-[3rem_minmax(0,1fr)_repeat(5,minmax(2.25rem,2.5rem))]";

    const statsDesktop = blind ? (
      <span
        className={`${isFootball ? "col-span-4" : "col-span-5"} text-[9px] font-black uppercase tracking-widest text-sport/50 italic`}
      >
        {dict.statsHidden}
      </span>
    ) : (
      <>
        {statEntries.map(({ label, value }) => (
          <span
            key={label}
            className="border-x border-white/5 bg-black/20 py-2 text-center font-display tabular-nums text-sm text-text first:rounded-l last:rounded-r"
          >
            {value}
          </span>
        ))}
        {isFootball && showOvr && (
          <span
            className={`rounded-r border-x border-white/5 bg-black/20 py-2 text-center font-display tabular-nums text-sm ${
              isHighRated ? "text-gold" : "text-sport"
            }`}
          >
            {player.rating}
          </span>
        )}
      </>
    );

    return (
      <motion.button
        type="button"
        layout
        onClick={onSelect}
        disabled={disabled || !onSelect}
        whileTap={onSelect && !disabled ? { scale: 0.985 } : undefined}
        transition={{ duration: 0.2, ease: EASE_SMOOTH }}
        className={`group w-full border px-3 py-2.5 text-left transition-colors ${
          selected
            ? "border-sport bg-sport/10"
            : "border-white/10 bg-white/[0.03] hover:border-sport/40"
        } ${disabled ? "cursor-not-allowed opacity-50" : onSelect ? "cursor-pointer" : "cursor-default"}`}
      >
        <div className="flex flex-col gap-2.5 md:hidden">
          <div className="flex min-w-0 items-center gap-3">
            {photoEl}
            {nameBlock}
          </div>
          {statsMobile}
        </div>
        <div className={`hidden md:grid md:items-center md:gap-2 ${gridCols}`}>
          {photoEl}
          {nameBlock}
          {statsDesktop}
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      layout
      onClick={onSelect}
      disabled={disabled || !onSelect}
      whileTap={onSelect && !disabled ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2, ease: EASE_SMOOTH }}
      className={`group relative flex w-full flex-col overflow-hidden border text-left transition-colors duration-200 ${
        selected
          ? "border-sport shadow-[0_0_24px_var(--sport-glow)] z-10"
          : "border-border/80 hover:border-sport/50"
      } ${disabled ? "cursor-not-allowed opacity-40" : onSelect ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className="broadcast-panel flex flex-col gap-3 p-4 sm:p-5">
        {sport && (sport === "basketball" || sport === "football") && (
          <div
            className={`relative mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-sport/40 shadow-[0_0_24px_var(--sport-glow)] ${
              sport === "football"
                ? "bg-gradient-to-br from-[#143d1a] to-[#0a1f0e]"
                : "bg-black/50"
            }`}
          >
            {photoUrl && showPhotoImage ? (
              <Image
                src={photoUrl}
                alt=""
                fill
                className="object-cover object-top"
                sizes="96px"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-display text-2xl text-sport/80">
                {initialsFromName(player.name)}
              </span>
            )}
          </div>
        )}
        <div className="flex items-start justify-between gap-3">
          <span className="min-w-0 break-words font-display text-xl leading-none tracking-wide text-text sm:text-2xl lg:text-3xl">
            {player.name.toUpperCase()}
          </span>
          <span
            className="shrink-0 px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white"
            style={{ backgroundColor: eraColor }}
          >
            {player.era}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {player.positions.map((pos) => (
            <span
              key={pos}
              className="border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-muted"
            >
              {pos}
            </span>
          ))}
          <span className="border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold italic tracking-widest text-muted">
            {player.club}
          </span>
        </div>

        {!blind ? (
          <div className="mt-1">
            {sport === "basketball" ? (
              <div className="grid grid-cols-5 divide-x divide-white/10 rounded-lg border border-white/10 bg-[rgba(10,20,40,0.6)]">
                {statEntries.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-0.5 px-0.5 py-2 sm:gap-1 sm:px-1 sm:py-3"
                  >
                    <span className="text-[9px] font-semibold uppercase tracking-wide text-text/70 sm:text-[11px]">
                      {label}
                    </span>
                    <span className="font-semibold tabular-nums text-sm text-text sm:text-lg">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            ) : sport === "football" && statEntries.length > 0 ? (
              <div className="grid grid-cols-3 divide-x divide-white/10 rounded-lg border border-white/10 bg-[rgba(10,20,40,0.6)]">
                {statEntries.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-0.5 px-0.5 py-2 sm:gap-1 sm:px-1 sm:py-3"
                  >
                    <span className="text-[9px] font-semibold uppercase tracking-wide text-text/70 sm:text-[11px]">
                      {label}
                    </span>
                    <span className="font-semibold tabular-nums text-sm text-text sm:text-lg">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            ) : statEntries.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {statEntries.map(({ label, value }) => (
                  <span
                    key={label}
                    className="border border-white/10 bg-black/40 px-2 py-1 text-[11px] font-black tracking-widest text-text"
                  >
                    <span className="mr-1 uppercase text-muted/60">{label}</span> {value}
                  </span>
                ))}
              </div>
            ) : null}
            {showOvr && (
              <div className="mt-3 flex items-center gap-3 border border-white/10 bg-black/20 p-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                  OVR {player.rating}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden bg-white/10">
                  <div
                    className={`h-full ${isHighRated ? "bg-gold" : "bg-sport"}`}
                    style={{ width: `${ratingPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-2 text-[11px] font-black uppercase tracking-[0.3em] text-sport/60 italic">
            {dict.statsHidden}
          </p>
        )}
      </div>
    </motion.button>
  );
}
