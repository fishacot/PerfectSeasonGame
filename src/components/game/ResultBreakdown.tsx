import type { SimulationResult, SportId } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localizedGateMessage } from "@/lib/simulation/basketball/gate-i18n";
import { Trophy, Activity, Info, AlertTriangle, Zap, Star, TrendingDown } from "lucide-react";

interface ResultBreakdownProps {
  result: SimulationResult;
  dict: Dictionary;
  sport?: SportId;
  displayWins?: number | null;
}

export function ResultBreakdown({ result, dict, sport, displayWins }: ResultBreakdownProps) {
  const { wins, losses, draws, maxWins, perfect, breakdown } = result;
  const shownWins = displayWins ?? wins;
  const categories = Object.entries(breakdown.categories);
  const tierLabel =
    breakdown.tier && breakdown.tier in dict.tiers
      ? dict.tiers[breakdown.tier as keyof typeof dict.tiers]
      : null;
  const gateText = localizedGateMessage(
    dict,
    breakdown.gateKey,
    breakdown.gateMessage,
  );
  const showBasketballTotals =
    sport === "basketball" &&
    breakdown.categoryTotals &&
    breakdown.categoryTargets;

  return (
    <div className="flex flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 bg-surface/80 p-4 backdrop-blur-xl shadow-2xl relative sm:p-6">
      <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[80px] opacity-20 ${perfect ? "bg-gold" : "bg-sport"}`} />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="micro-label text-muted">
            {dict.record.toUpperCase()}
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <span className="font-display text-5xl leading-none tracking-wider text-text drop-shadow-xl sm:text-7xl">
              {shownWins}
              <span className="text-sport">–</span>
              {losses}
            </span>
            {draws > 0 && (
              <span className="font-display text-4xl text-muted leading-none">–{draws}</span>
            )}
          </div>
          <p className="mt-2 text-sm font-semibold text-muted">
            {dict.seasonGames.replace("{max}", String(maxWins))}
            {" · "}
            {dict.winRate}: {Math.round((shownWins / maxWins) * 100)}%
            {sport === "football" && draws >= 0 && (
              <>
                {" · "}
                {dict.pointsOf
                  .replace("{pts}", String(shownWins * 3 + draws))
                  .replace("{max}", String(maxWins * 3))}
              </>
            )}
          </p>
          {tierLabel && (
            <p className="mt-3 font-display text-2xl tracking-[0.1em] text-gold uppercase">
              {tierLabel}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-row items-center gap-3 sm:flex-col sm:gap-2">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 font-display text-3xl tracking-widest shadow-2xl sm:h-20 sm:w-20 sm:text-4xl ${
              perfect
                ? "border-gold bg-gold/20 text-gold glow-gold gold-foil-border"
                : "border-sport bg-sport/10 text-sport glow-sport"
            }`}
          >
            {breakdown.grade}
          </div>
          <span className="micro-label text-muted">
            {dict.grade}
          </span>
        </div>
      </div>

      {(breakdown.bestPickName || breakdown.weakestCategory) && (
        <div className="relative z-10 grid gap-3 sm:grid-cols-2">
          {breakdown.bestPickName && (
            <div className="flex items-center gap-4 rounded-2xl border border-sport/30 bg-sport/5 p-5">
              <Star className="h-6 w-6 shrink-0 text-sport" />
              <div>
                <p className="micro-label text-muted">
                  {dict.bestPick}
                </p>
                <p className="font-display text-xl text-text tracking-wide">{breakdown.bestPickName.toUpperCase()}</p>
              </div>
            </div>
          )}
          {breakdown.weakestCategory && !perfect && (
            <div className="flex items-center gap-4 rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
              <TrendingDown className="h-6 w-6 shrink-0 text-red-500" />
              <div>
                <p className="micro-label text-muted">
                  {dict.weakestArea}
                </p>
                <p className="font-display text-xl text-red-500 tracking-wide">{breakdown.weakestCategory.toUpperCase()}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {breakdown.gateMessage && (
        <div
          className={`relative z-10 flex gap-3 rounded-2xl border p-4 transition-all duration-500 ${
            perfect
              ? "border-gold/30 bg-gold/10 text-gold"
              : "border-white/10 bg-white/5 text-text"
          }`}
        >
          {perfect ? (
            <Trophy className="h-5 w-5 shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 shrink-0 text-muted" />
          )}
          <p className="text-sm font-medium leading-relaxed">{gateText}</p>
        </div>
      )}

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="h-3 w-3 text-muted" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
              {dict.metricsBreakdown}
            </span>
          </div>
          {breakdown.combo != null && sport === "basketball" && (
            <span className="text-[10px] font-black uppercase tracking-widest text-sport">
              {dict.teamCombo}: {breakdown.combo}%
            </span>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map(([name, value]) => {
            const isWeakest = name === breakdown.weakestCategory && !perfect;
            const total = breakdown.categoryTotals?.[name];
            const target = breakdown.categoryTargets?.[name];
            return (
              <div
                key={name}
                className={`flex flex-col gap-2 rounded-2xl border bg-bg/40 p-3 transition-all duration-500 ${
                  isWeakest
                    ? "border-red-500/30 bg-red-500/5"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex justify-between items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-[0.1em] ${
                      isWeakest ? "text-red-400" : "text-muted"
                    }`}
                  >
                    {name}
                  </span>
                  <div className="text-right">
                    {showBasketballTotals && total != null && target != null && (
                      <p
                        className={`text-[10px] font-bold tabular-nums ${
                          isWeakest ? "text-red-300/80" : "text-muted"
                        }`}
                      >
                        {total} / {target}
                      </p>
                    )}
                    <span
                      className={`tabular-nums text-sm font-bold ${
                        isWeakest ? "text-red-400" : "text-text"
                      }`}
                    >
                      {Math.round(value)}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-bg shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isWeakest ? "bg-red-500" : perfect ? "bg-gold" : "bg-sport"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {breakdown.chemistry > 1 && sport !== "basketball" && (
        <div className="relative z-10 mt-2 flex items-center justify-center gap-2 overflow-hidden rounded-lg border border-sport/20 bg-[#0a1428]/80 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
          <Zap className="h-4 w-4 text-sport" />
          <p className="text-xs font-bold uppercase tracking-widest text-sport">
            {dict.chemistryMultiplier}: +{Math.round((breakdown.chemistry - 1) * 100)}%
          </p>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-4 right-4 opacity-10">
        <Activity className="h-24 w-24" />
      </div>
    </div>
  );
}
