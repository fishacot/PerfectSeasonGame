import { notFound } from "next/navigation";
import { SportPlay } from "@/components/game/SportPlay";
import {
  FOOTBALL_LEAGUES,
  getFootballEras,
} from "@/lib/config/leagues/football";
import { getFootballClubs } from "@/lib/data/loaders";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";
import type { FootballLeague } from "@/lib/types";

export function generateStaticParams() {
  return Object.keys(FOOTBALL_LEAGUES).map((league) => ({ league }));
}

export default async function FootballPlayPage({
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

  return (
    <SportPlay
      sport="football"
      locale={locale}
      dict={dict}
      players={[]}
      clubs={getFootballClubs(league)}
      eras={getFootballEras(league)}
      brand={config.brand}
      league={league}
      deferPlayerLoad
    />
  );
}
