import { ERA_COLORS, ERA_RULES } from "@/lib/config/eras";
import { countByEra } from "@/lib/game/validation";
import type { Era, SportId } from "@/lib/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useParams } from "next/navigation";

type EraChipState = "empty" | "partial" | "done";

interface EraTrackerProps {
  sport: SportId;
  eras: readonly Era[];
  usedEras: Era[];
}

function chipState(sport: SportId, count: number): EraChipState {
  const rules = ERA_RULES[sport];
  const max = rules.maxPerEra;

  if (count === 0) return "empty";
  if (count >= max) return "done";
  return "partial";
}

const stateStyles: Record<EraChipState, string> = {
  empty: "border-border bg-bg text-muted",
  partial: "border-[var(--sport-primary)]/50 bg-[var(--sport-primary)]/10 text-text",
  done: "border-[var(--sport-primary)] bg-[var(--sport-primary)]/20 text-[var(--sport-primary)]",
};

export function EraTracker({ sport, eras, usedEras }: EraTrackerProps) {
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const dict = getDictionary(locale as any);
  const counts = countByEra(usedEras);
  const max = ERA_RULES[sport].maxPerEra;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="micro-label text-muted opacity-60">{dict.eraDistribution}</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <div className="flex flex-wrap gap-2.5">
        {eras.map((era) => {
          const count = counts.get(era) ?? 0;
          const state = chipState(sport, count);
          const color = ERA_COLORS[era] ?? "#64748b";

          return (
            <div
              key={era}
              className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-500 ${
                state === 'done' 
                  ? 'border-sport bg-sport/10 shadow-[0_0_20px_var(--sport-glow)]' 
                  : state === 'partial'
                    ? 'border-sport/30 bg-sport/5'
                    : 'border-white/5 bg-white/5 opacity-30 hover:opacity-50'
              }`}
            >
              <div
                className={`h-2.5 w-2.5 rounded-full shadow-[0_0_10px_currentColor] transition-all duration-700 group-hover:scale-125`}
                style={{ backgroundColor: color, color: color }}
                aria-hidden
              />
              <div className="flex flex-col leading-none">
                <span className={`font-display text-base tracking-widest ${state === 'empty' ? 'text-muted' : 'text-text'}`}>
                  {era}
                </span>
                <div className="mt-1.5 flex gap-1">
                  {Array.from({ length: max }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 w-2.5 rounded-full transition-all duration-700 ${i < count ? 'bg-sport' : 'bg-white/10'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
