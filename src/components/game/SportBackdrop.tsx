"use client";

import type { ReactNode } from "react";
import type { SportId } from "@/lib/types";

const SPORT_BG: Record<SportId, string> = {
  basketball: "/backgrounds/basketball-arena.webp",
  football: "/backgrounds/football-stadium.webp",
  hockey: "/backgrounds/hockey-rink.webp",
};

interface SportBackdropProps {
  sport: SportId;
  children: ReactNode;
  className?: string;
}

/** Sport-specific broadcast atmosphere (arena / pitch / rink). */
export function SportBackdrop({ sport, children, className = "" }: SportBackdropProps) {
  return (
    <div className={`relative min-h-[50vh] ${className}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 sm:opacity-30"
          style={{ backgroundImage: `url(${SPORT_BG[sport]})` }}
        />
        {sport === "basketball" && (
          <div
            className="absolute inset-x-0 bottom-0 h-64 bg-repeat opacity-[0.06] sm:h-96 sm:opacity-[0.1]"
            style={{
              backgroundImage: "url(/textures/parquet.webp)",
              backgroundSize: "128px 128px",
            }}
          />
        )}
        {sport === "football" && (
          <div
            className="absolute inset-x-0 bottom-0 h-64 bg-repeat opacity-[0.07] sm:h-96 sm:opacity-[0.12]"
            style={{
              backgroundImage: "url(/textures/grass.webp)",
              backgroundSize: "128px 128px",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/95 via-bg/70 to-bg/95" />
      </div>
      <div className="relative z-10 min-w-0">{children}</div>
    </div>
  );
}
