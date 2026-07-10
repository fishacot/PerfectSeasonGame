"use client";

import Link from "next/link";
import { SportThemeProvider } from "@/components/SportThemeProvider";
import { SportBackdrop } from "@/components/game/SportBackdrop";
import { EdgeHeroes as BasketballEdgeHeroes } from "@/components/basketball/EdgeHeroes";
import { EdgeHeroes as FootballEdgeHeroes } from "@/components/football/EdgeHeroes";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale, SportId } from "@/lib/types";

interface SandboxShellProps {
  sport: "basketball" | "football";
  locale: Locale;
  dict: Dictionary;
  playHref: string;
}

/** Instant sandbox chrome while the sandbox bundle and player pool load. */
export function SandboxShell({ sport, locale, dict, playHref }: SandboxShellProps) {
  const sb = dict.sandbox;
  const Heroes = sport === "basketball" ? BasketballEdgeHeroes : FootballEdgeHeroes;

  return (
    <SportThemeProvider sport={sport}>
      <Heroes phase="draft" />
      <SportBackdrop sport={sport} className="min-h-screen">
        <div
          className="page-shell relative z-10 mx-auto flex min-w-0 max-w-5xl flex-col gap-5 py-6 sm:gap-6 sm:py-10"
          aria-busy="true"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-display text-3xl tracking-tight text-sport sm:text-5xl">
                {sb.title.toUpperCase()}
              </h1>
              <p className="mt-1 text-xs text-muted sm:text-sm">{sb.subtitle}</p>
            </div>
            <Link
              href={playHref}
              className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-sport"
            >
              {dict.play} →
            </Link>
          </div>

          <div className="grid gap-3 sm:gap-4">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted">
              {sb.modesTitle}
            </p>
            {[sb.lineupMode, sb.matchMode].map((title) => (
              <div
                key={title}
                className="animate-pulse rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6"
              >
                <div className="font-display text-xl tracking-wide text-muted/60 sm:text-2xl">
                  {title.toUpperCase()}
                </div>
                <div className="mt-2 h-3 w-4/5 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </SportBackdrop>
    </SportThemeProvider>
  );
}
