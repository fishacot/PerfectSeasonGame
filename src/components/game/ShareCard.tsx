"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { ERA_COLORS } from "@/lib/config/eras";
import { SPORTS } from "@/lib/config/sports";
import { getPlayerPhotoUrl } from "@/lib/assets/player-photos";
import type { Era, SportId, PlayerSeason } from "@/lib/types";
import type { Locale } from "@/lib/types";

interface ShareCardLabels {
  legend: string;
  finalRecord: string;
  winRate: string;
  points?: string;
  erasConquered: string;
  perfectSeason: string;
  hubTag: string;
}

interface ShareCardProps {
  sport: SportId;
  locale?: Locale;
  wins: number;
  losses: number;
  draws?: number;
  maxWins: number;
  eras: Era[];
  lineup?: PlayerSeason[];
  perfect?: boolean;
  labels: ShareCardLabels;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard(
    {
      sport,
      locale = "en",
      wins,
      losses,
      draws = 0,
      maxWins,
      eras,
      lineup = [],
      perfect = false,
      labels,
    },
    ref,
  ) {
    const config = SPORTS[sport];
    const uniqueEras = [...new Set(eras)];
    const sportName = config.name[locale];
    const points = wins * 3 + draws;

    return (
      <div
        ref={ref}
        className="relative flex flex-col justify-between overflow-hidden bg-[#05070a] text-[#f8fafc]"
        style={{ width: 1200, height: 630, padding: 80 }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at 100% 0%, var(--sport-glow), transparent 70%),
              radial-gradient(circle at 0% 100%, var(--sport-glow), transparent 60%)
            `,
          }}
        />

        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #ffffff 1px, transparent 1px), linear-gradient(-45deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-sport shadow-[0_0_40px_var(--sport-glow)]">
                <span className="text-6xl drop-shadow-xl">{config.emoji}</span>
              </div>
              <div>
                <h1 className="font-display text-8xl tracking-tighter text-text">
                  {config.brand.toUpperCase()}
                </h1>
                <p className="text-2xl font-bold uppercase tracking-[0.4em] text-sport opacity-80">
                  {sportName} {labels.legend}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end text-right">
            <p className="mb-2 text-xl font-black uppercase tracking-[0.3em] text-muted">
              {labels.finalRecord}
            </p>
            <div className="flex items-baseline gap-4">
              <p className="font-display text-[160px] leading-[0.8] tracking-tighter text-text drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                {wins}-{losses}
              </p>
              {draws > 0 && (
                <p className="font-display text-8xl leading-none text-muted">-{draws}</p>
              )}
            </div>
            <p className="mt-4 text-3xl font-bold text-muted">
              {labels.winRate}: {Math.round((wins / maxWins) * 100)}%
              {sport === "football" && labels.points && (
                <>
                  {" · "}
                  {labels.points}: {points}/{maxWins * 3}
                </>
              )}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-end justify-between">
          <div className="max-w-2xl">
            <p className="mb-6 text-xl font-black uppercase tracking-[0.3em] text-muted">
              {labels.erasConquered}
            </p>
            <div className="flex flex-wrap gap-4">
              {uniqueEras.map((era) => (
                <div
                  key={era}
                  className="flex items-center gap-4 border border-white/10 bg-white/5 px-6 py-4"
                >
                  <div
                    className="h-4 w-4 rounded-full shadow-[0_0_15px_currentColor]"
                    style={{
                      backgroundColor: ERA_COLORS[era] ?? "#64748b",
                      color: ERA_COLORS[era] ?? "#64748b",
                    }}
                  />
                  <span className="text-2xl font-black uppercase tracking-widest text-text">
                    {era}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {perfect && (
              <div className="mb-4 border-2 border-gold bg-gold/10 px-8 py-3 glow-gold">
                <p className="font-display text-5xl tracking-[0.2em] text-gold">
                  {labels.perfectSeason}
                </p>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-12 rounded-full bg-sport" />
              <p className="font-display text-2xl tracking-[0.3em] text-muted">
                {labels.hubTag.replace(/\s+HUB$/i, "")}{" "}
                <span className="text-sport">HUB</span>
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 flex gap-4 overflow-hidden">
          {lineup.slice(0, 11).map((player, idx) => {
            const photo = getPlayerPhotoUrl(sport, player.name);
            return (
              <div
                key={player.id ?? idx}
                className="relative flex h-32 w-28 flex-col items-center justify-center border border-white/10 bg-white/5 p-2"
              >
                {photo ? (
                  <div className="relative mb-2 h-10 w-10 overflow-hidden rounded-full border border-sport/30">
                    <Image
                      src={photo}
                      alt=""
                      fill
                      className="object-cover object-top"
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-sport/30 bg-sport/10 text-[10px] font-bold text-sport">
                    {player.positions[0]}
                  </div>
                )}
                <p className="text-center font-display text-lg leading-tight text-text">
                  {player.name.split(" ").pop()?.toUpperCase()}
                </p>
                <p className="mt-1 text-[8px] font-black uppercase tracking-widest text-muted">
                  {player.era}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
