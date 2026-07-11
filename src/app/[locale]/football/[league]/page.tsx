import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FOOTBALL_LEAGUES,
  getFootballEras,
} from "@/lib/config/leagues/football";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";
import type { FootballLeague } from "@/lib/types";
import { SportBackdrop } from "@/components/game/SportBackdrop";
import { EdgeHeroes } from "@/components/football/EdgeHeroes";
import { Trophy, Info } from "lucide-react";

export function generateStaticParams() {
  return Object.keys(FOOTBALL_LEAGUES).map((league) => ({ league }));
}

export default async function FootballLeaguePage({
  params,
}: {
  params: Promise<{ locale: string; league: string }>;
}) {
  const { locale, league: leagueId } = await params;
  if (!isValidLocale(locale)) notFound();
  if (!(leagueId in FOOTBALL_LEAGUES)) notFound();

  const league = leagueId as FootballLeague;
  const config = FOOTBALL_LEAGUES[league];
  const dict = getDictionary(locale);
  const eras = getFootballEras(league);

  return (
    <div className="relative min-h-screen" data-sport="football">
      <EdgeHeroes phase="mode-select" league={league} />
      <SportBackdrop sport="football" className="min-h-screen">
        <div className="page-shell relative py-8 sm:py-16 lg:py-20">
          <div className="mb-8 overflow-hidden rounded-lg border border-white/15 bg-[#0a1428]/90 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md sm:mb-12">
            <div className="flex flex-wrap items-stretch">
              <div className="flex min-w-[5rem] shrink-0 flex-col items-center justify-center bg-sport px-4 py-3 sm:min-w-[6rem]">
                <span className="text-[8px] font-black uppercase tracking-widest text-bg/70 sm:text-[9px]">
                  38-0
                </span>
                <span className="font-display text-lg leading-none text-bg sm:text-xl">
                  XI
                </span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center border-l border-white/10 px-4 py-3 sm:px-6">
                <span className="truncate font-display text-sm tracking-widest text-text sm:text-lg">
                  {config.name[locale].toUpperCase()}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-sport sm:text-[10px]">
                  {config.brand} — {eras[0]} · {eras[eras.length - 1]}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 sm:gap-8">
            <div className="flex flex-col justify-between overflow-hidden rounded-lg border border-white/15 bg-[#0a1428]/90 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-8">
              <div>
                <div className="mb-5 flex items-center gap-3 sm:mb-6">
                  <div className="rounded-xl bg-sport/10 p-2.5 text-sport sm:rounded-2xl sm:p-3">
                    <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <p className="font-display text-xl tracking-wide sm:text-3xl">CAMPAIGN GOAL</p>
                </div>

                <p className="text-sm leading-relaxed text-muted sm:text-lg">
                  {locale === "ru"
                    ? `Собери элитный состав из 11 легенд разных эпох (${eras[0]} — ${eras[eras.length - 1]}). Выдержи испытание в ${config.seasonGames} матчей.`
                    : `Assemble an elite XI of 11 legends from different eras (${eras[0]} — ${eras[eras.length - 1]}). Survive a grueling ${config.seasonGames}-match campaign.`}
                </p>
              </div>

              <Link
                href={`/${locale}/football/${league}/play`}
                className="mt-8 flex items-center justify-center rounded-xl bg-sport py-4 font-display text-xl tracking-[0.15em] text-bg shadow-[0_15px_40px_var(--sport-glow)] transition-all hover:glow-sport active:scale-95 sm:mt-10 sm:rounded-2xl sm:py-6 sm:text-3xl sm:tracking-[0.2em]"
              >
                {dict.play.toUpperCase()}
              </Link>
            </div>

            <div className="overflow-hidden rounded-lg border border-white/15 bg-[#0a1428]/90 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-8">
              <div className="mb-6 flex items-center gap-3 sm:mb-8">
                <div className="rounded-xl bg-white/10 p-2.5 text-text sm:rounded-2xl sm:p-3">
                  <Info className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <p className="font-display text-xl tracking-wide sm:text-3xl">LEAGUE PROTOCOLS</p>
              </div>

              <div className="space-y-5 sm:space-y-6">
                {[
                  {
                    title: "Random Draft",
                    body:
                      locale === "ru"
                        ? "Каждый раунд — случайный клуб и эра."
                        : "Each round reveals a random franchise and era pool.",
                  },
                  {
                    title: "Era Balance",
                    body:
                      locale === "ru"
                        ? "Нужны все 3 эры (мин. 1 игрок из каждой), макс. 4 из одной."
                        : "All 3 eras required (min 1 each); max 4 from a single decade.",
                  },
                  {
                    title: "Tactical Skips",
                    body:
                      locale === "ru"
                        ? "Один пропуск клуба и один — эры за драфт."
                        : "One team skip and one era skip per draft.",
                  },
                ].map((rule, i) => (
                  <div key={rule.title} className="flex gap-3 sm:gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-display text-lg text-sport sm:h-10 sm:w-10 sm:rounded-xl sm:text-xl">
                      {i + 1}
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-text">
                        {rule.title}
                      </p>
                      <p className="text-sm text-muted">{rule.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center sm:mt-12">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted opacity-40 sm:text-[10px] sm:tracking-[0.4em]">
              PERFECT SEASON ENGINE v2.0
            </p>
          </div>
        </div>
      </SportBackdrop>
    </div>
  );
}
