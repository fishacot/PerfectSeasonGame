"use client";

import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SPORTS } from "@/lib/config/sports";
import { EASE_SMOOTH } from "@/lib/game/spin-timing";
import { getPlayerPhotoUrl } from "@/lib/assets/player-photos";
import type { PlayerSeason, SportId } from "@/lib/types";
import { Plus } from "lucide-react";

interface LineupBoardProps {
  variant: SportId;
  lineup: Map<string, PlayerSeason>;
  positions?: string[];
  formationLabel?: string;
  onSlotTap?: (slotKey: string) => void;
  activeSlot?: string | null;
  placing?: boolean;
  compact?: boolean;
}

interface Slot {
  key: string;
  label: string;
}

interface CourtSpot {
  left: string;
  top: string;
}

function buildSlots(positions: string[]): Slot[] {
  const seen = new Map<string, number>();
  return positions.map((pos) => {
    const idx = seen.get(pos) ?? 0;
    seen.set(pos, idx + 1);
    return { key: `${pos}:${idx}`, label: pos };
  });
}

const BASKETBALL_SPOTS: Record<string, CourtSpot> = {
  PG: { left: "50%", top: "14%" },
  SG: { left: "78%", top: "32%" },
  SF: { left: "22%", top: "32%" },
  PF: { left: "28%", top: "68%" },
  C: { left: "72%", top: "68%" },
};

const FOOTBALL_FORMATION: CourtSpot[] = [
  { left: "50%", top: "8%" },
  { left: "12%", top: "28%" },
  { left: "38%", top: "24%" },
  { left: "62%", top: "24%" },
  { left: "88%", top: "28%" },
  { left: "22%", top: "52%" },
  { left: "50%", top: "48%" },
  { left: "78%", top: "52%" },
  { left: "18%", top: "78%" },
  { left: "50%", top: "82%" },
  { left: "82%", top: "78%" },
];

const HOCKEY_FORMATION: CourtSpot[] = [
  { left: "50%", top: "22%" },
  { left: "22%", top: "38%" },
  { left: "78%", top: "38%" },
  { left: "35%", top: "58%" },
  { left: "65%", top: "58%" },
  { left: "50%", top: "84%" },
];

const bgStyles: Record<SportId, string> = {
  football: "",
  basketball: "",
  hockey:
    "bg-[radial-gradient(circle_at_center,#e0f2f1_1px,transparent_1px)] [background-size:30px_30px] bg-[#f0f9ff]",
};

/** Full pitch markings — viewBox 68×105 (width × length). */
function FootballPitchSvg() {
  const line = "rgba(255,255,255,0.45)";
  const lineThin = "rgba(255,255,255,0.28)";

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 68 105"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <linearGradient id="pitch-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a4d24" />
          <stop offset="50%" stopColor="#143d1a" />
          <stop offset="100%" stopColor="#0f2e14" />
        </linearGradient>
      </defs>
      <rect width="68" height="105" fill="url(#pitch-grass)" />
      <rect
        x="1"
        y="1"
        width="66"
        height="103"
        fill="none"
        stroke={line}
        strokeWidth="0.6"
      />
      <line x1="1" y1="52.5" x2="67" y2="52.5" stroke={line} strokeWidth="0.5" />
      <circle cx="34" cy="52.5" r="9.15" fill="none" stroke={line} strokeWidth="0.5" />
      <circle cx="34" cy="52.5" r="0.6" fill={line} />
      {/* Top penalty area */}
      <rect x="13.84" y="1" width="40.32" height="16.5" fill="none" stroke={line} strokeWidth="0.5" />
      <rect x="24.84" y="1" width="18.32" height="5.5" fill="none" stroke={lineThin} strokeWidth="0.4" />
      <circle cx="34" cy="11" r="0.5" fill={line} />
      {/* Bottom penalty area */}
      <rect x="13.84" y="87.5" width="40.32" height="16.5" fill="none" stroke={line} strokeWidth="0.5" />
      <rect x="24.84" y="98.5" width="18.32" height="5.5" fill="none" stroke={lineThin} strokeWidth="0.4" />
      <circle cx="34" cy="94" r="0.5" fill={line} />
    </svg>
  );
}

function FootballPitchFloor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "url(/textures/grass.webp)",
          backgroundSize: "96px 96px",
        }}
      />
      <FootballPitchSvg />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/15" />
    </div>
  );
}

/** NBA half-court — viewBox 50×47 ft, basket at bottom. */
function BasketballHalfCourtSvg() {
  const line = "rgba(255,255,255,0.42)";
  const lineThin = "rgba(255,255,255,0.28)";
  const keyFill = "rgba(255,255,255,0.04)";

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 50 47"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <linearGradient id="court-wood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3d2518" />
          <stop offset="50%" stopColor="#4a2e1c" />
          <stop offset="100%" stopColor="#352015" />
        </linearGradient>
      </defs>
      <rect width="50" height="47" fill="url(#court-wood)" />
      {/* Sidelines + baseline */}
      <rect
        x="0.35"
        y="0.35"
        width="49.3"
        height="46.3"
        fill="none"
        stroke={line}
        strokeWidth="0.35"
      />
      {/* Half-court line (top) */}
      <line x1="0.35" y1="0.35" x2="49.65" y2="0.35" stroke={line} strokeWidth="0.4" />
      {/* Center circle (half) */}
      <path
        d="M 18.5 0.35 A 6.5 6.5 0 0 0 31.5 0.35"
        fill="none"
        stroke={line}
        strokeWidth="0.35"
      />
      {/* Key / paint — 16ft wide, 19ft from baseline */}
      <rect
        x="17"
        y="28"
        width="16"
        height="19"
        fill={keyFill}
        stroke={line}
        strokeWidth="0.35"
      />
      {/* Free-throw circle */}
      <circle
        cx="25"
        cy="28"
        r="6"
        fill="none"
        stroke={line}
        strokeWidth="0.35"
      />
      {/* Restricted area arc */}
      <path
        d="M 22 38.5 A 3 3 0 0 0 28 38.5"
        fill="none"
        stroke={lineThin}
        strokeWidth="0.3"
      />
      {/* 3-point arc */}
      <path
        d="M 0.35 47 L 0.35 36.5 Q 25 20 49.65 36.5 L 49.65 47"
        fill="none"
        stroke={line}
        strokeWidth="0.35"
      />
      {/* Backboard + rim */}
      <line x1="22" y1="44.2" x2="28" y2="44.2" stroke={line} strokeWidth="0.45" />
      <circle cx="25" cy="43.2" r="0.75" fill="none" stroke="rgba(255,145,0,0.7)" strokeWidth="0.35" />
    </svg>
  );
}

function BasketballCourtFloor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "url(/textures/parquet.webp)",
          backgroundSize: "88px 88px",
        }}
      />
      <BasketballHalfCourtSvg />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
    </div>
  );
}

const pitchLines: Record<SportId, ReactNode> = {
  football: <FootballPitchFloor />,
  basketball: <BasketballCourtFloor />,
  hockey: (
    <div className="pointer-events-none absolute inset-0 opacity-10">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-red-500" />
      <div className="absolute inset-x-0 top-1/3 h-px bg-blue-500" />
      <div className="absolute inset-x-0 bottom-1/3 h-px bg-blue-500" />
      <div className="absolute left-1/4 top-1/4 h-12 w-12 rounded-full border border-red-500" />
      <div className="absolute right-1/4 top-1/4 h-12 w-12 rounded-full border border-red-500" />
    </div>
  ),
};

function spotForSlot(variant: SportId, slot: Slot, index: number): CourtSpot {
  if (variant === "basketball") {
    return BASKETBALL_SPOTS[slot.label] ?? { left: "50%", top: "50%" };
  }
  if (variant === "football") {
    return FOOTBALL_FORMATION[index] ?? { left: "50%", top: "50%" };
  }
  return HOCKEY_FORMATION[index] ?? { left: "50%", top: "50%" };
}

interface SlotButtonProps {
  slot: Slot;
  player?: PlayerSeason;
  filled: boolean;
  isActive: boolean;
  placing: boolean;
  compact: boolean;
  variant: SportId;
  onSlotTap?: (slotKey: string) => void;
  style?: CSSProperties;
  className?: string;
}

function SlotButton({
  slot,
  player,
  filled,
  isActive,
  placing,
  compact,
  variant,
  onSlotTap,
  style,
  className = "",
}: SlotButtonProps) {
  const isBasketball = variant === "basketball";
  const isFootball = variant === "football";
  const useCircleSlots = isBasketball || isFootball;
  const circleSize = compact ? "h-10 w-10 sm:h-11 sm:w-11" : "h-11 w-11 sm:h-12 sm:w-12";
  const defaultSize = compact ? "h-14 w-14 sm:h-16 sm:w-16" : "h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20";
  const photoUrl = player ? getPlayerPhotoUrl(variant, player.name) : null;

  return (
    <motion.button
      type="button"
      layout
      key={player?.id ?? slot.key}
      onClick={() => onSlotTap?.(slot.key)}
      disabled={!onSlotTap || (!placing && !filled)}
      style={style}
      initial={filled ? { scale: 0.82, opacity: 0.55 } : false}
      animate={{
        scale: isActive ? 1.1 : 1,
        opacity: 1,
      }}
      transition={{ duration: 0.38, ease: EASE_SMOOTH }}
      className={`group relative flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center ${className} ${
        useCircleSlots ? circleSize : `${defaultSize} gap-1 rounded-2xl border`
      } ${
        useCircleSlots
          ? isActive
            ? "z-30 scale-110"
            : filled
              ? "z-20"
              : "z-10"
          : isActive
            ? "z-30 border-sport bg-sport/20 glow-sport ring-2 ring-sport/20"
            : filled
              ? "border-white/20 bg-black/60 backdrop-blur-sm hover:border-sport/40"
              : "border-dashed border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
      } ${onSlotTap && placing ? "cursor-pointer" : filled ? "cursor-default" : "cursor-not-allowed"}`}
    >
      <div
        className={`relative z-10 flex items-center justify-center overflow-hidden font-display tracking-wide ${
          useCircleSlots
            ? `rounded-full border-2 shadow-lg backdrop-blur-sm ${
                compact ? "h-full w-full text-[9px]" : "h-full w-full text-[10px] sm:text-xs"
              } ${
                isActive
                  ? "border-sport bg-sport text-bg glow-sport"
                  : filled
                    ? "border-white/30 bg-black/70 text-text"
                    : "border-white/25 bg-black/50 text-white/70"
              }`
            : `rounded-full border text-[10px] font-bold ${
                compact ? "h-6 w-6" : "h-8 w-8"
              } ${
                filled
                  ? "border-sport/30 bg-sport/10 text-sport"
                  : "border-white/20 bg-white/5 text-white/40"
              }`
        }`}
      >
        {useCircleSlots && filled && photoUrl ? (
          <Image
            src={photoUrl}
            alt=""
            fill
            className="object-cover object-top"
            sizes="48px"
          />
        ) : (
          slot.label
        )}
      </div>

      {!useCircleSlots && (
        <div className="relative z-10 w-full px-1 text-center">
          {player ? (
            <span
              className={`block truncate ${compact ? "text-[8px]" : "text-[9px] sm:text-[10px]"} font-bold uppercase tracking-wider text-text drop-shadow-md`}
            >
              {player.name.split(" ").pop()}
            </span>
          ) : placing ? (
            <Plus
              className={`mx-auto ${compact ? "h-3 w-3" : "h-3.5 w-3.5 sm:h-4 sm:w-4"} animate-pulse text-white/40`}
            />
          ) : (
            <div className="mx-auto h-1 w-4 rounded-full bg-white/10" />
          )}
        </div>
      )}

      {useCircleSlots && player && (
        <span
          className={`absolute top-full mt-1 max-w-[4.5rem] truncate text-center font-bold uppercase tracking-wider text-text drop-shadow-md ${
            compact ? "text-[7px]" : "text-[8px] sm:text-[9px]"
          }`}
        >
          {player.name.split(" ").pop()}
        </span>
      )}

      {filled && !useCircleSlots && (
        <div
          className={`absolute ${compact ? "top-1 right-1 h-1 w-1" : "top-1.5 right-1.5 h-1.5 w-1.5"} z-20 rounded-full bg-sport shadow-[0_0_8px_var(--sport-primary)]`}
        />
      )}
    </motion.button>
  );
}

export function LineupBoard({
  variant,
  lineup,
  positions: positionsOverride,
  formationLabel,
  onSlotTap,
  activeSlot,
  placing = false,
  compact = false,
}: LineupBoardProps) {
  const positions = positionsOverride ?? SPORTS[variant].positions;
  const slots = buildSlots(positions);
  const isBasketball = variant === "basketball";
  const isFootball = variant === "football";
  const useBroadcastShell = isBasketball || isFootball;

  const boardMinHeight = compact
    ? "min-h-0"
    : useBroadcastShell
      ? "min-h-0"
      : "min-h-[280px] sm:min-h-[400px]";
  const boardHeight = compact
    ? useBroadcastShell
      ? ""
      : "h-[300px] sm:h-[320px]"
    : useBroadcastShell
      ? ""
      : "h-[380px] sm:h-[420px]";

  const aspectClass = isBasketball
    ? "aspect-[50/47]"
    : isFootball
      ? "aspect-[68/105]"
      : "";

  const shell = (
    <>
      {pitchLines[variant]}

      {isFootball && formationLabel && (
        <div className="absolute left-3 top-3 z-20 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-sport backdrop-blur-sm">
          {formationLabel}
        </div>
      )}

      <div className={`relative z-10 w-full ${boardHeight} ${aspectClass}`}>
        {slots.map((slot, index) => {
          const player = lineup.get(slot.key) ?? lineup.get(slot.label);
          const filled = Boolean(player);
          const isActive = activeSlot === slot.key || activeSlot === slot.label;
          const spot = spotForSlot(variant, slot, index);

          return (
            <SlotButton
              key={slot.key}
              slot={slot}
              player={player}
              filled={filled}
              isActive={isActive}
              placing={placing}
              compact={compact}
              variant={variant}
              onSlotTap={onSlotTap}
              style={{ position: "absolute", left: spot.left, top: spot.top }}
            />
          );
        })}
      </div>
    </>
  );

  if (useBroadcastShell) {
    return (
      <div
        className={`mx-auto w-full ${
          compact
            ? isFootball
              ? "max-w-[220px]"
              : "max-w-[280px]"
            : isFootball
              ? "max-w-[min(100%,300px)]"
              : "max-w-[min(100%,360px)]"
        }`}
      >
        <div
          className={`relative overflow-hidden rounded-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.45)] sm:rounded-3xl ${boardMinHeight}`}
        >
          {shell}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 p-3 shadow-2xl transition-all duration-500 sm:rounded-3xl ${compact ? "sm:p-4" : "sm:p-6"} ${boardMinHeight} ${bgStyles[variant]}`}
    >
      {shell}
    </div>
  );
}
