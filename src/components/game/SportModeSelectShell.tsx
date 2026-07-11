"use client";

import Link from "next/link";
import { SportThemeProvider } from "@/components/SportThemeProvider";
import { SportBackdrop } from "@/components/game/SportBackdrop";
import { EdgeHeroes as BasketballEdgeHeroes } from "@/components/basketball/EdgeHeroes";
import { EdgeHeroes as FootballEdgeHeroes } from "@/components/football/EdgeHeroes";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale, SportId } from "@/lib/types";

interface SportModeSelectShellProps {
  sport: SportId;
  locale: Locale;
  dict: Dictionary;
  brand: string;
}

/** Instant mode-select chrome while the game bundle and player pool load. */
export function SportModeSelectShell({
  sport,
  locale,
  dict,
  brand,
}: SportModeSelectShellProps) {
  const placeholders =
    sport === "basketball"
      ? [
          dict.classic.toUpperCase(),
          dict.blind.toUpperCase(),
          dict.cpuMode.toUpperCase(),
          dict.vsFriend.toUpperCase(),
        ]
      : [
          dict.classic.toUpperCase(),
          dict.blind.toUpperCase(),
          dict.cpuMode.toUpperCase(),
        ];

  const content = (
    <div className="page-shell mx-auto flex max-w-lg flex-col gap-5 py-6 sm:gap-8 sm:py-10 lg:max-w-xl">
      <div className="text-center">
        <h1 className="page-title text-sport drop-shadow-[0_0_20px_var(--sport-glow)]">
          {brand.toUpperCase()}
        </h1>
        <p className="page-subtitle mt-2 font-medium uppercase text-muted">
          {dict.tagline}
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4" aria-busy="true" aria-label={dict.tagline}>
        {placeholders.map((title) => (
          <div
            key={title}
            className="animate-pulse rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6"
          >
            <div className="font-display text-xl tracking-wide text-muted/60 sm:text-2xl">
              {title}
            </div>
            <div className="mt-2 h-3 w-3/4 rounded bg-white/10" />
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col items-center gap-3 sm:mt-6 sm:gap-4">
        <div className="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-center backdrop-blur-sm sm:p-6">
          <p className="text-xs leading-relaxed text-muted italic">
            &ldquo;{dict.hubQuote}&rdquo;
          </p>
        </div>
        <Link
          href={`/${locale}/how-to-play`}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-sport"
        >
          {dict.howToPlay} →
        </Link>
      </div>
    </div>
  );

  return (
    <SportThemeProvider sport={sport}>
      {sport === "basketball" || sport === "football" ? (
        <>
          {sport === "basketball" ? (
            <BasketballEdgeHeroes phase="mode-select" />
          ) : (
            <FootballEdgeHeroes phase="mode-select" />
          )}
          <SportBackdrop sport={sport} className="min-h-screen">
            {content}
          </SportBackdrop>
        </>
      ) : (
        content
      )}
    </SportThemeProvider>
  );
}
