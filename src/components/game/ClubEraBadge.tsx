"use client";

import { useEffect, useState } from "react";
import type { Era } from "@/lib/types";
import {
  getClubCrest,
  getClubLogoCdnSrc,
  getClubLogoSrc,
} from "@/lib/assets/club-crests";

function ClubLogo({ club, size = 36 }: { club: string; size?: number }) {
  const localSrc = getClubLogoSrc(club);
  const cdnSrc = getClubLogoCdnSrc(club);
  const crest = getClubCrest(club);
  const [src, setSrc] = useState<string | null>(localSrc);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(localSrc);
    setFailed(false);
  }, [localSrc, club]);

  if (!failed && src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- small badge; next/image overkill
      <img
        src={src}
        alt=""
        aria-hidden
        draggable={false}
        width={size}
        height={size}
        className="shrink-0 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
        style={{ width: size, height: size }}
        onError={() => {
          if (cdnSrc && src !== cdnSrc) {
            setSrc(cdnSrc);
            return;
          }
          setFailed(true);
        }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(145deg, ${crest.primary}, ${crest.secondary})`,
      }}
    >
      {crest.abbr}
    </span>
  );
}

/** Compact franchise + era chip for pool / score lower-thirds. */
export function ClubEraBadge({
  club,
  era,
}: {
  club?: string;
  era?: Era | string | null;
}) {
  if (!club && !era) return null;
  const label = [club, era].filter(Boolean).join(" · ");

  return (
    <div
      className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3"
      title={label}
    >
      {club && <ClubLogo club={club} size={40} />}
      <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
        {club && (
          <span className="truncate font-display text-base leading-none tracking-wide text-text sm:text-lg">
            {club.toUpperCase()}
          </span>
        )}
        {era && (
          <span className="inline-flex shrink-0 items-center rounded-md border border-sport/40 bg-sport/20 px-2 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-sport shadow-[0_0_12px_var(--sport-glow)]">
            {String(era).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}
