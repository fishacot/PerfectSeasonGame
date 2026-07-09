import Link from "next/link";
import { notFound } from "next/navigation";
import { FOOTBALL_LEAGUES } from "@/lib/config/leagues/football";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";
import type { FootballLeague } from "@/lib/types";
import { SportBackdrop } from "@/components/game/SportBackdrop";
import { ChevronLeft } from "lucide-react";

export default async function FootballHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const leagues = Object.keys(FOOTBALL_LEAGUES) as FootballLeague[];

  return (
    <SportBackdrop sport="football" className="min-h-screen">
      <div className="page-shell relative py-8 sm:py-16" data-sport="football">
        <div className="relative z-10 mb-10 sm:mb-14">
          <Link
            href={`/${locale}`}
            className="group micro-label flex items-center gap-2 text-muted transition-all hover:text-sport"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {locale === "ru" ? "НАЗАД В ХАБ" : "BACK TO HUB"}
          </Link>
          <h1 className="page-title mt-6 text-text sm:mt-8">
            FOOTBALL{" "}
            <span className="text-sport drop-shadow-[0_0_30px_var(--sport-glow)]">LEAGUES</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm font-medium italic leading-relaxed text-muted opacity-80 sm:mt-6 sm:text-lg">
            {dict.football.desc}
          </p>
        </div>

        <div className="relative z-10 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {leagues.map((id) => {
            const lg = FOOTBALL_LEAGUES[id];
            return (
              <Link
                key={id}
                href={`/${locale}/football/${id}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface/50 p-5 transition-all duration-300 hover:border-sport hover:glow-sport sm:rounded-3xl sm:p-8 sm:hover:scale-[1.02]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-0 transition-all duration-700 group-hover:scale-110 group-hover:opacity-20"
                  style={{ backgroundImage: "url(/backgrounds/football-stadium.webp)" }}
                  aria-hidden
                />
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-sport/5 blur-3xl transition-all duration-700 group-hover:bg-sport/20 group-hover:blur-2xl" />

                <div className="relative z-10">
                  <span className="font-display text-2xl tracking-widest text-sport drop-shadow-[0_0_10px_var(--sport-glow)] sm:text-4xl">
                    {lg.brand}
                  </span>
                  <h3 className="mt-2 font-display text-lg uppercase tracking-wide text-text transition-colors group-hover:text-sport sm:mt-3 sm:text-2xl">
                    {lg.name[locale]}
                  </h3>
                  <div className="mt-5 flex items-center gap-3 sm:mt-8">
                    <div className="h-1 w-8 rounded-full bg-white/10 transition-all duration-700 group-hover:w-16 group-hover:bg-sport sm:w-10 sm:group-hover:w-20" />
                    <p className="micro-label text-muted opacity-60 group-hover:opacity-100">
                      {lg.seasonGames} {locale === "ru" ? "МАТЧЕЙ" : "MATCHES"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </SportBackdrop>
  );
}
