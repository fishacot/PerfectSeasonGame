import Link from "next/link";
import Image from "next/image";
import { SPORTS } from "@/lib/config/sports";
import type { Locale, SportId } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import { getPlayerPhotoUrl } from "@/lib/assets/player-photos";

interface SportCardProps {
  sport: SportId;
  locale: Locale;
  href: string;
  comingSoon?: boolean;
  comingSoonLabel?: string;
}

const ARENA_BG: Record<SportId, string> = {
  football: "/backgrounds/football-stadium.webp",
  basketball: "/backgrounds/basketball-arena.webp",
  hockey: "/backgrounds/hockey-rink.webp",
};

/** Hero cutout on desktop cards only — not full-bleed on mobile */
const HERO_CUTOUT: Partial<Record<SportId, string>> = {
  basketball: "LeBron James",
  football: "Lamine Yamal",
  hockey: "Alexander Ovechkin",
};

/** Per-sport hero framing on broadcast cards */
const HERO_FRAME: Partial<
  Record<SportId, { width: string; height: string; maxW: string; gradient: string }>
> = {
  football: {
    width: "w-[62%]",
    height: "h-[125%]",
    maxW: "max-w-[240px]",
    gradient: "from-bg via-bg/70 to-bg/15",
  },
  basketball: {
    width: "w-[48%]",
    height: "h-[118%]",
    maxW: "max-w-[220px]",
    gradient: "from-bg via-bg/85 to-transparent",
  },
  hockey: {
    width: "w-[52%]",
    height: "h-[120%]",
    maxW: "max-w-[220px]",
    gradient: "from-bg via-bg/80 to-transparent",
  },
};

export function SportCard({
  sport,
  locale,
  href,
  comingSoon = false,
  comingSoonLabel = "Coming soon",
}: SportCardProps) {
  const config = SPORTS[sport];
  const heroName = HERO_CUTOUT[sport];
  const cutout = heroName ? getPlayerPhotoUrl(sport, heroName) : null;
  const frame = HERO_FRAME[sport];

  const mobile = (
    <div className="flex items-center gap-4 p-4 sm:hidden">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sport/15 text-2xl ring-1 ring-sport/25">
        <span aria-hidden>{config.emoji}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-xl tracking-wide text-text">
            {config.name[locale].toUpperCase()}
          </h2>
          {comingSoon && (
            <span className="rounded-md border border-amber-400/40 bg-amber-400/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-amber-200">
              {comingSoonLabel}
            </span>
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted">
          {config.description[locale]}
        </p>
        <span className="mt-2 inline-block font-display text-sm tracking-widest text-sport">
          {config.brand}
        </span>
      </div>
      {!comingSoon && (
        <ChevronRight className="h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-sport" />
      )}
    </div>
  );

  const desktop = (
    <div className="relative hidden h-52 overflow-hidden sm:block lg:h-60">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 transition-opacity duration-500 group-hover:opacity-60"
        style={{ backgroundImage: `url(${ARENA_BG[sport]})` }}
        aria-hidden="true"
      />
      <div
        className={`absolute inset-0 bg-gradient-to-r ${frame?.gradient ?? "from-bg via-bg/85 to-transparent"}`}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-30"
        style={{
          background: `radial-gradient(circle at 20% 50%, var(--sport-glow), transparent 65%)`,
        }}
        aria-hidden="true"
      />

      {cutout && (
        <div
          className={`pointer-events-none absolute bottom-0 right-0 translate-y-1 transition-transform duration-500 group-hover:scale-[1.03] ${
            frame
              ? `${frame.width} ${frame.height} ${frame.maxW}`
              : "h-[115%] w-[42%] max-w-[200px] translate-x-2 translate-y-2 group-hover:scale-105"
          }`}
        >
          <Image
            src={cutout}
            alt=""
            fill
            className="portrait-cutout object-cover object-[center_12%]"
            sizes="260px"
            priority={sport === "football"}
          />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-bg/80 via-bg/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-sport/25 to-transparent blur-xl" />
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col justify-between p-6 lg:p-8">
        <div className="flex items-start justify-between gap-3">
          <span className="text-3xl drop-shadow-lg lg:text-4xl" aria-hidden="true">
            {config.emoji}
          </span>
          {comingSoon ? (
            <span className="rounded-lg border border-amber-400/40 bg-amber-400/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-amber-200 backdrop-blur-md">
              {comingSoonLabel}
            </span>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-md transition-all group-hover:border-sport/40 group-hover:bg-sport group-hover:text-bg">
              <ChevronRight className="h-5 w-5" />
            </div>
          )}
        </div>

        <div className="max-w-[62%] pr-2 sm:max-w-[58%]">
          <h2 className="font-display text-3xl tracking-wide text-text drop-shadow-md lg:text-4xl">
            {config.name[locale].toUpperCase()}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted/90 group-hover:text-text">
            {config.description[locale]}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="h-1 w-10 rounded-full bg-sport transition-all group-hover:w-16" />
            <span className="font-display text-sm tracking-widest text-sport">
              {config.brand}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const className = `group relative overflow-hidden rounded-xl border border-white/10 bg-surface/80 transition-all duration-300 ${
    comingSoon
      ? "cursor-default opacity-90"
      : "hover:border-sport/50 hover:glow-sport"
  }`;

  if (comingSoon) {
    return (
      <div data-sport={sport} className={className} aria-disabled>
        {mobile}
        {desktop}
      </div>
    );
  }

  return (
    <Link href={href} data-sport={sport} className={className}>
      {mobile}
      {desktop}
    </Link>
  );
}
