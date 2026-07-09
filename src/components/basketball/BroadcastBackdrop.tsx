"use client";

import type { ReactNode } from "react";

interface BroadcastBackdropProps {
  children: ReactNode;
  className?: string;
}

/** NBA broadcast atmosphere — arena + parquet (basketball only). */
export function BroadcastBackdrop({ children, className = "" }: BroadcastBackdropProps) {
  return (
    <div className={`relative min-h-[50vh] ${className}`}>
      {/* Background layer - now absolute, scrolls WITH content */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 sm:opacity-30"
          style={{ backgroundImage: "url(/backgrounds/basketball-arena.webp)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-64 bg-repeat opacity-[0.06] sm:h-96 sm:opacity-[0.1]"
          style={{
            backgroundImage: "url(/textures/parquet.webp)",
            backgroundSize: "128px 128px",
          }}
        />
        {/* Stronger content scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/95 via-bg/70 to-bg/95" />
      </div>

      <div className="relative z-10 min-w-0">{children}</div>
    </div>
  );
}
