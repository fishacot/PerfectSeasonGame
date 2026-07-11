"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Era } from "@/lib/types";
import { Sparkles } from "lucide-react";
import {
  DRUM_HEIGHT,
  EASE_SMOOTH,
  SPIN_CLUB_MS,
  SPIN_ERA_MS,
  easeOutCubic,
} from "@/lib/game/spin-timing";
import { getClubCrest, getClubLogoCdnSrc, getClubLogoSrc } from "@/lib/assets/club-crests";

interface SlotMachineProps {
  club: string | null;
  era: Era | null;
  clubs: readonly string[];
  eras: readonly Era[];
  isSpinning: boolean;
  spinningClub?: boolean;
  spinningEra?: boolean;
  onSpin: () => void;
  spinLabel: string;
  selectFranchise: string;
  selectEra: string;
  analyzing: string;
  disabled?: boolean;
  hideButton?: boolean;
  /** Hide inline SPIN below lg (fixed bottom bar owns the CTA). */
  hideButtonBelowLg?: boolean;
}

function ClubCrestBadge({
  club,
  size = "md",
  dimmed = false,
}: {
  club: string;
  size?: "sm" | "md" | "lg";
  dimmed?: boolean;
}) {
  const crest = getClubCrest(club);
  const localSrc = getClubLogoSrc(club);
  const cdnSrc = getClubLogoCdnSrc(club);
  const [src, setSrc] = useState<string | null>(localSrc);
  const [failed, setFailed] = useState(false);
  const dim =
    size === "sm" ? "h-9 w-9" : size === "lg" ? "h-14 w-14" : "h-11 w-11";

  useEffect(() => {
    setSrc(localSrc);
    setFailed(false);
  }, [localSrc, club]);

  if (!failed && src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- many reel frames; plain img is lighter than next/image
      <img
        src={src}
        alt=""
        aria-hidden
        draggable={false}
        className={`shrink-0 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] ${dim} ${
          dimmed ? "opacity-45" : "opacity-100"
        }`}
        onError={() => {
          if (cdnSrc && src !== cdnSrc) {
            setSrc(cdnSrc);
            return;
          }
          setFailed(true);
        }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full font-black tracking-wider text-white shadow-[0_0_12px_rgba(0,0,0,0.45)] ring-2 ${dim} text-[9px] ${
        dimmed ? "opacity-40" : "opacity-100"
      }`}
      style={{
        background: `linear-gradient(145deg, ${crest.primary} 0%, ${crest.secondary} 100%)`,
        borderColor: crest.secondary,
      }}
    >
      {crest.abbr}
    </span>
  );
}

function SlotDrum({
  items,
  value,
  spinning,
  spinDurationMs,
  withCrests = false,
}: {
  items: readonly string[];
  value: string | null;
  spinning: boolean;
  spinDurationMs: number;
  withCrests?: boolean;
}) {
  const reel = useMemo(() => {
    if (items.length === 0) return ["—"];
    return [...items, ...items, ...items];
  }, [items]);

  const itemHeight = DRUM_HEIGHT;
  const cycleHeight = items.length * itemHeight;
  const [offset, setOffset] = useState(0);
  const [landed, setLanded] = useState(false);
  const rafRef = useRef<number | null>(null);

  const landOffset = useMemo(() => {
    if (!value || items.length === 0) return 0;
    const idx = items.indexOf(value);
    if (idx < 0) return 0;
    return idx * itemHeight + cycleHeight;
  }, [value, items, itemHeight, cycleHeight]);

  useEffect(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (!spinning) {
      if (value) {
        setOffset(landOffset);
        setLanded(true);
      }
      return;
    }

    setLanded(false);
    const start = performance.now();
    const extraCycles = 2 + Math.floor(Math.random() * 2);
    const totalTravel = cycleHeight * extraCycles + landOffset;

    const tick = (now: number) => {
      const t = Math.min((now - start) / spinDurationMs, 1);
      const eased = easeOutCubic(t);
      setOffset(eased * totalTravel);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setOffset(landOffset);
        setLanded(true);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [spinning, spinDurationMs, landOffset, cycleHeight, value]);

  const display = value ?? "???";

  return (
    <div className="relative h-[80px] w-full overflow-hidden rounded-xl border-2 border-border bg-bg/90 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-14 -translate-y-1/2 border-y border-sport/40 bg-sport/10 shadow-[0_0_30px_var(--sport-glow)]" />

      {spinning || !value ? (
        <motion.div
          className="flex flex-col items-center will-change-transform"
          style={{ transform: `translateY(${-offset}px)` }}
          animate={
            spinning
              ? { filter: ["blur(0px)", "blur(1.2px)", "blur(0px)"] }
              : { filter: "blur(0px)" }
          }
          transition={
            spinning
              ? { duration: 0.12, repeat: Infinity, ease: "linear" }
              : { duration: 0.2 }
          }
        >
          {reel.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className={`flex h-[80px] w-full items-center justify-center gap-2.5 truncate px-2 text-center font-display text-lg leading-tight tracking-wide sm:gap-3 sm:px-3 sm:text-xl sm:tracking-[0.12em] ${
                spinning ? "text-muted/35" : "text-muted/20"
              }`}
            >
              {withCrests && item !== "—" && (
                <ClubCrestBadge club={item} size="sm" dimmed={spinning} />
              )}
              <span className="min-w-0 truncate">{item.toUpperCase()}</span>
            </span>
          ))}
        </motion.div>
      ) : (
        <motion.div
          key={display}
          initial={{ y: 18, opacity: 0, scale: 0.96, filter: "blur(8px)" }}
          animate={{
            y: 0,
            opacity: 1,
            scale: landed ? [1, 1.04, 1] : 1,
            filter: "blur(0px)",
          }}
          transition={{ duration: 0.45, ease: EASE_SMOOTH }}
          className="relative z-30 flex h-full w-full items-center justify-center gap-3 px-2 text-center sm:gap-4 sm:px-4"
        >
          {withCrests && (
            <motion.div
              initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE_SMOOTH }}
            >
              <ClubCrestBadge club={display} size="lg" />
            </motion.div>
          )}
          <span
            className={`line-clamp-2 min-w-0 max-w-full font-display text-xl leading-tight tracking-wide drop-shadow-[0_0_18px_var(--sport-glow)] sm:truncate sm:text-3xl sm:tracking-[0.12em] ${
              landed ? "animate-pulse-soft text-sport" : "text-sport/90"
            }`}
          >
            {display.toUpperCase()}
          </span>
        </motion.div>
      )}
    </div>
  );
}

export function SlotMachine({
  club,
  era,
  clubs,
  eras,
  isSpinning,
  spinningClub,
  spinningEra,
  onSpin,
  spinLabel,
  selectFranchise,
  selectEra,
  analyzing,
  disabled = false,
  hideButton = false,
  hideButtonBelowLg = false,
}: SlotMachineProps) {
  const clubSpinning = spinningClub ?? isSpinning;
  const eraSpinning = spinningEra ?? isSpinning;
  const anySpinning = clubSpinning || eraSpinning;

  return (
    <motion.div
      layout
      className="relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 bg-surface/30 p-4 shadow-2xl backdrop-blur-2xl sm:gap-8 sm:p-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_SMOOTH }}
    >
      <div className="pointer-events-none absolute -inset-24 bg-sport/10 opacity-40 blur-[100px]" />

      <div className="relative z-10 grid gap-4 sm:gap-6">
        <motion.div
          className="flex flex-col gap-2 sm:gap-3"
          animate={clubSpinning ? { scale: 1.01 } : { scale: 1 }}
          transition={{ duration: 0.3, ease: EASE_SMOOTH }}
        >
          <span className="micro-label text-muted">{selectFranchise}</span>
          <SlotDrum
            items={clubs}
            value={club}
            spinning={clubSpinning}
            spinDurationMs={SPIN_CLUB_MS}
            withCrests
          />
        </motion.div>
        <motion.div
          className="flex flex-col gap-2 sm:gap-3"
          animate={eraSpinning ? { scale: 1.01 } : { scale: 1 }}
          transition={{ duration: 0.3, ease: EASE_SMOOTH }}
        >
          <span className="micro-label text-muted">{selectEra}</span>
          <SlotDrum items={eras} value={era} spinning={eraSpinning} spinDurationMs={SPIN_ERA_MS} />
        </motion.div>
      </div>

      {!hideButton && (
        <motion.button
          type="button"
          onClick={onSpin}
          disabled={disabled || anySpinning}
          whileHover={disabled || anySpinning ? undefined : { scale: 1.02 }}
          whileTap={disabled || anySpinning ? undefined : { scale: 0.98 }}
          className={`relative z-10 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-sport py-4 font-display text-2xl tracking-[0.15em] text-bg shadow-[0_15px_40px_var(--sport-glow)] transition-[box-shadow,opacity] duration-300 hover:glow-sport disabled:cursor-not-allowed disabled:opacity-20 disabled:shadow-none sm:gap-4 sm:py-6 sm:text-3xl sm:tracking-[0.2em] ${
            hideButtonBelowLg ? "hidden lg:flex" : "flex"
          }`}
        >
          {anySpinning ? (
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-bg border-t-transparent" />
              <span>{analyzing}</span>
            </div>
          ) : (
            <>
              <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
              <span>{spinLabel.toUpperCase()}</span>
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );
}
