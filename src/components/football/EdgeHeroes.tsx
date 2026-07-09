"use client";

import Image from "next/image";
import { getPlayerPhotoUrl } from "@/lib/assets/player-photos";

const EDGE_LEGENDS = [
  "Thierry Henry",
  "Cristiano Ronaldo",
  "Lionel Messi",
  "Zinedine Zidane",
  "Paolo Maldini",
  "Erling Haaland",
] as const;

/** Optional single-league accent cutout (league info hero). */
const LEAGUE_LEGEND: Record<string, string> = {
  epl: "Thierry Henry",
  laliga: "Lionel Messi",
  seriea: "Paolo Maldini",
};

interface EdgeHeroesProps {
  phase?: "mode-select" | "draft" | "result";
  /** When set, show one league legend on the right instead of the full flank set. */
  league?: string;
}

/** Cutout legends flanking the pitch (broadcast edges). */
export function EdgeHeroes({ phase = "draft", league }: EdgeHeroesProps) {
  if (phase === "draft") return null;

  const leagueLegend = league ? LEAGUE_LEGEND[league] : undefined;
  if (leagueLegend) {
    const src = getPlayerPhotoUrl("football", leagueLegend);
    if (!src) return null;
    return (
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden opacity-35 xl:block"
        aria-hidden="true"
      >
        <div className="absolute bottom-0 right-0 h-[75vh] w-[min(28vw,320px)]">
          <Image
            src={src}
            alt=""
            fill
            className="portrait-cutout object-contain object-bottom drop-shadow-[0_0_40px_rgba(0,230,118,0.25)]"
            sizes="320px"
            priority
          />
        </div>
      </div>
    );
  }

  const left = EDGE_LEGENDS.slice(0, 3);
  const right = EDGE_LEGENDS.slice(3, 6);
  const opacity = phase === "mode-select" ? "opacity-30" : "opacity-40";

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 hidden overflow-hidden xl:block ${opacity}`}
      aria-hidden="true"
    >
      <div className="absolute bottom-0 left-0 flex h-[80vh] items-end gap-0">
        {left.map((name, i) => {
          const src = getPlayerPhotoUrl("football", name);
          if (!src) return null;
          return (
            <div
              key={name}
              className="relative -ml-12 h-full w-[min(20vw,280px)] transition-transform duration-1000"
              style={{ transform: `translateY(${i * 20}px)` }}
            >
              <Image
                src={src}
                alt=""
                fill
                className="portrait-cutout object-contain object-bottom drop-shadow-[0_0_40px_rgba(0,230,118,0.22)]"
                sizes="280px"
                priority={i === 0}
              />
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-0 right-0 flex h-[80vh] items-end justify-end gap-0">
        {right.map((name, i) => {
          const src = getPlayerPhotoUrl("football", name);
          if (!src) return null;
          return (
            <div
              key={name}
              className="relative -mr-12 h-full w-[min(20vw,280px)] transition-transform duration-1000"
              style={{ transform: `scaleX(-1) translateY(${i * 20}px)` }}
            >
              <Image
                src={src}
                alt=""
                fill
                className="portrait-cutout object-contain object-bottom drop-shadow-[0_0_40px_rgba(255,234,0,0.12)]"
                sizes="280px"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
