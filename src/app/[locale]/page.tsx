import Link from "next/link";
import { notFound } from "next/navigation";
import { DailyLeaderboardStub } from "@/components/game/DailyLeaderboardStub";
import { SportCard } from "@/components/game/SportCard";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";
import type { Locale, SportId } from "@/lib/types";

const SPORT_IDS: SportId[] = ["football", "basketball", "hockey"];

export default async function HubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <div className="page-shell relative py-8 sm:py-16 lg:py-24">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center opacity-[0.12]"
        style={{ backgroundImage: "url(/backgrounds/hub-arena-mosaic.webp)" }}
        aria-hidden
      />

      <div className="relative z-10 mb-6 rounded-xl border border-sport/20 bg-sport/5 px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-sport">
        {dict.dailyBanner}
      </div>

      <div className="relative z-10 mb-4 flex flex-wrap justify-center gap-4">
        {SPORT_IDS.filter((s) => s !== "hockey").map((sport) => (
          <DailyLeaderboardStub key={sport} sport={sport} />
        ))}
      </div>

      <div className="relative z-10 mb-8 text-center sm:mb-14">
        <h1 className="page-title text-text drop-shadow-2xl">
          PERFECT<span className="ml-[0.15em] opacity-60">SEASON</span>
        </h1>
        <div className="mt-4 flex flex-col items-center gap-3 sm:mt-6 sm:gap-5">
          <p className="page-subtitle max-w-2xl px-1 font-bold uppercase text-muted opacity-90">
            {dict.taglineHero}
          </p>
          <div className="h-1 w-16 rounded-full bg-white/20 sm:w-28" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-lg flex-col gap-3 sm:max-w-none sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-7">
        {SPORT_IDS.map((sport) => (
          <SportCard
            key={sport}
            sport={sport}
            locale={locale as Locale}
            comingSoon={sport === "hockey"}
            comingSoonLabel={dict.hockey.comingSoon}
            href={
              sport === "football"
                ? `/${locale}/football`
                : sport === "basketball"
                  ? `/${locale}/basketball`
                  : `/${locale}/hockey`
            }
          />
        ))}
      </div>

      <div className="relative z-10 mt-6 text-center sm:mt-10">
        <Link
          href={`/${locale}/how-to-play`}
          className="text-xs font-bold uppercase tracking-widest text-muted hover:text-sport sm:text-sm"
        >
          {dict.howToPlay} →
        </Link>
      </div>

      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="absolute -left-1/4 top-1/4 h-64 w-64 rounded-full bg-white/5 blur-[100px] sm:h-96 sm:w-96 sm:blur-[120px]" />
        <div className="absolute -right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-white/10 blur-[100px] sm:h-96 sm:w-96 sm:blur-[120px]" />
      </div>
    </div>
  );
}
