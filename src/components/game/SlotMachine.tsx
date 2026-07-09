"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Era } from "@/lib/types";
import { Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  DRUM_HEIGHT,
  EASE_SMOOTH,
  SPIN_CLUB_MS,
  SPIN_ERA_MS,
  easeOutCubic,
} from "@/lib/game/spin-timing";

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
  disabled?: boolean;
  hideButton?: boolean;
}

function SlotDrum({
  items,
  value,
  spinning,
  spinDurationMs,
}: {
  items: readonly string[];
  value: string | null;
  spinning: boolean;
  spinDurationMs: number;
}) {
  const reel = useMemo(() => {
    if (items.length === 0) return ["—"];
    return [...items, ...items, ...items, ...items, ...items];
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
    return idx * itemHeight + cycleHeight * 2;
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
              ? { filter: ["blur(0px)", "blur(1.5px)", "blur(0px)"] }
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
              className={`flex h-[80px] w-full items-center justify-center truncate px-3 font-display text-xl tracking-[0.2em] ${
                spinning ? "text-muted/25" : "text-muted/20"
              }`}
            >
              {item.toUpperCase()}
            </span>
          ))}
        </motion.div>
      ) : (
        <motion.div
          key={display}
          initial={{ y: 18, opacity: 0, scale: 0.96, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.45, ease: EASE_SMOOTH }}
          className="relative z-30 flex h-full w-full items-center justify-center px-4 text-center"
        >
          <span
            className={`truncate font-display text-3xl tracking-[0.25em] drop-shadow-[0_0_15px_var(--sport-glow)] ${
              landed ? "text-sport" : "text-sport/90"
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
  disabled = false,
  hideButton = false,
}: SlotMachineProps) {
  const clubSpinning = spinningClub ?? isSpinning;
  const eraSpinning = spinningEra ?? isSpinning;
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const dict = getDictionary(locale as "en" | "ru");
  const anySpinning = clubSpinning || eraSpinning;

  return (
    <motion.div
      layout
      className="relative flex flex-col gap-8 overflow-hidden rounded-3xl border border-white/10 bg-surface/30 p-8 shadow-2xl backdrop-blur-2xl"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_SMOOTH }}
    >
      <div className="pointer-events-none absolute -inset-24 bg-sport/10 opacity-40 blur-[100px]" />

      <div className="relative z-10 grid gap-6">
        <motion.div
          className="flex flex-col gap-3"
          animate={clubSpinning ? { scale: 1.01 } : { scale: 1 }}
          transition={{ duration: 0.3, ease: EASE_SMOOTH }}
        >
          <span className="micro-label text-muted">{dict.selectFranchise}</span>
          <SlotDrum
            items={clubs}
            value={club}
            spinning={clubSpinning}
            spinDurationMs={SPIN_CLUB_MS}
          />
        </motion.div>
        <motion.div
          className="flex flex-col gap-3"
          animate={eraSpinning ? { scale: 1.01 } : { scale: 1 }}
          transition={{ duration: 0.3, ease: EASE_SMOOTH }}
        >
          <span className="micro-label text-muted">{dict.selectEra}</span>
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
          className="relative z-10 flex items-center justify-center gap-4 overflow-hidden rounded-2xl bg-sport py-6 font-display text-3xl tracking-[0.2em] text-bg shadow-[0_15px_40px_var(--sport-glow)] transition-[box-shadow,opacity] duration-300 hover:glow-sport disabled:cursor-not-allowed disabled:opacity-20 disabled:shadow-none"
        >
          {anySpinning ? (
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-bg border-t-transparent" />
              <span>{dict.analyzing}</span>
            </div>
          ) : (
            <>
              <Sparkles className="h-7 w-7" />
              <span>{spinLabel.toUpperCase()}</span>
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );
}
