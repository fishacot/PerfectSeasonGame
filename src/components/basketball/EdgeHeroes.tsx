"use client";

import Image from "next/image";
import { getPlayerPhotoUrl } from "@/lib/assets/player-photos";

const EDGE_LEGENDS = [
  "Michael Jordan",
  "LeBron James",
  "Magic Johnson",
  "Kobe Bryant",
  "Larry Bird",
  "Stephen Curry",
] as const;

interface EdgeHeroesProps {
  phase?: "mode-select" | "draft" | "result";
}

/** Cutout legends flanking the court (broadcast edges). */
export function EdgeHeroes({ phase = "draft" }: EdgeHeroesProps) {
  // Only show on mode select and results, never during draft/spinning as requested
  if (phase === "draft") return null;

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
          const src = getPlayerPhotoUrl("basketball", name);
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
                className="portrait-cutout object-contain object-bottom drop-shadow-[0_0_40px_rgba(255,145,0,0.2)]"
                sizes="280px"
                priority={i === 0}
              />
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-0 right-0 flex h-[80vh] items-end justify-end gap-0">
        {right.map((name, i) => {
          const src = getPlayerPhotoUrl("basketball", name);
          if (!src) return null;
          return (
            <div
              key={name}
              className="relative -mr-12 h-full w-[min(20vw,280px)] scale-x-[-1] transition-transform duration-1000"
              style={{ transform: `scaleX(-1) translateY(${i * 20}px)` }}
            >
              <Image
                src={src}
                alt=""
                fill
                className="portrait-cutout object-contain object-bottom drop-shadow-[0_0_40px_rgba(101,31,255,0.15)]"
                sizes="280px"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
