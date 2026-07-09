import type { ComponentType, SVGProps } from "react";
import type { SportId } from "@/lib/types";

type MotifSvg = ComponentType<SVGProps<SVGSVGElement>>;

function BasketballBall(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props} aria-hidden>
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M32 4v56M4 32h56M12 14c10 8 30 8 40 0M12 50c10-8 30-8 40 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FootballBall(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props} aria-hidden>
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M32 18l10 7-4 12h-12l-4-12 10-7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M22 25L10 20M42 25l12-5M18 37l-8 10M46 37l8 10M28 49v10M36 49v10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HockeyStick(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props} aria-hidden>
      <path
        d="M18 8l8 40c1 5 4 8 10 8h16"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="44" cy="48" rx="7" ry="5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

const MOTIF: Record<SportId, MotifSvg> = {
  basketball: BasketballBall,
  football: FootballBall,
  hockey: HockeyStick,
};

/** Inline SVG tile icon for mobile sport cards. */
export function SportMotifIcon({
  sport,
  className = "h-7 w-7",
}: {
  sport: SportId;
  className?: string;
}) {
  const Icon = MOTIF[sport];
  return (
    <span className={`inline-flex text-sport ${className}`}>
      <Icon className="h-full w-full" />
    </span>
  );
}

/** Soft corner watermarks — mobile/tablet only. */
export function SportMotifs({
  sport,
  className = "",
}: {
  sport?: SportId;
  className?: string;
}) {
  const primary = sport ?? "basketball";
  const Icon = MOTIF[primary];

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden xl:hidden ${className}`}
      aria-hidden
    >
      <Icon className="absolute -left-6 top-16 h-28 w-28 rotate-[-18deg] text-sport opacity-[0.12]" />
      <Icon className="absolute -right-8 bottom-24 h-36 w-36 rotate-[22deg] text-sport opacity-[0.1]" />
      {!sport && (
        <>
          <FootballBall className="absolute right-8 top-1/3 h-20 w-20 rotate-[12deg] text-white opacity-[0.06]" />
          <HockeyStick className="absolute bottom-40 left-10 h-16 w-16 -rotate-12 text-white opacity-[0.06]" />
        </>
      )}
    </div>
  );
}
