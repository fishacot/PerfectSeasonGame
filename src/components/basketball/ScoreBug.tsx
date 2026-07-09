"use client";

interface ScoreBugProps {
  round: number;
  rosterSize: number;
  mode: string;
  club?: string | null;
  era?: string | null;
  wins?: number | null;
  maxWins?: number;
  labelRound: string;
  labelMode: string;
}

/** ESPN/NBA-style score bug — stacks on narrow screens. */
export function ScoreBug({
  round,
  rosterSize,
  mode,
  club,
  era,
  wins,
  maxWins = 82,
  labelRound,
  labelMode,
}: ScoreBugProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/15 bg-[#0a1428]/90 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md">
      <div className="flex flex-wrap items-stretch">
        <div className="flex min-w-[4.25rem] shrink-0 flex-col items-center justify-center bg-sport px-3 py-2 sm:min-w-[4.5rem]">
          <span className="text-[8px] font-black uppercase tracking-widest text-bg/70 sm:text-[9px]">
            {labelRound}
          </span>
          <span className="font-display text-xl leading-none text-bg sm:text-2xl">
            {round}
            <span className="text-sm opacity-70 sm:text-base">/{rosterSize}</span>
          </span>
        </div>

        {(club || era) && (
          <div className="lower-third-enter flex min-w-0 flex-1 flex-col justify-center border-l border-white/10 bg-sport/10 px-3 py-2.5 sm:px-4">
            {club && (
              <span className="line-clamp-2 font-display text-base leading-tight tracking-wide text-text sm:truncate sm:text-sm sm:tracking-widest">
                {club.toUpperCase()}
              </span>
            )}
            {era && (
              <span className="mt-0.5 text-xs font-bold uppercase tracking-[0.18em] text-sport sm:text-[10px] sm:tracking-[0.2em]">
                {era}
              </span>
            )}
          </div>
        )}

        <div className="flex min-w-[5rem] flex-col justify-center border-l border-white/10 px-3 py-2 sm:px-4">
          <span className="text-[8px] font-black uppercase tracking-widest text-muted sm:text-[9px]">
            {labelMode}
          </span>
          <span className="truncate font-display text-xs uppercase tracking-widest text-text sm:text-sm">
            {mode}
          </span>
        </div>

        {wins != null && (
          <div className="flex w-full flex-col items-center justify-center border-t border-sport/30 bg-sport/10 px-4 py-2 sm:w-auto sm:border-t-0 sm:border-l sm:items-end sm:px-5">
            <span className="text-[8px] font-black uppercase tracking-widest text-sport sm:text-[9px]">
              W-L
            </span>
            <span className="font-display text-xl leading-none text-sport sm:text-2xl">
              {wins}
              <span className="text-sm text-muted">-{maxWins - wins}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
