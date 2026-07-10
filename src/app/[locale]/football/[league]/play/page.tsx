import { notFound } from "next/navigation";
import { SportPlay } from "@/components/game/SportPlay";
import {
  FOOTBALL_LEAGUES,
  getFootballEras,
} from "@/lib/config/leagues/football";
import { parseChallengePayload } from "@/lib/game/challenge";
import { getFootballClubs } from "@/lib/data/loaders";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";
import type { FootballLeague } from "@/lib/types";

export default async function FootballPlayPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; league: string }>;
  searchParams: Promise<{ challenge?: string }>;
}) {
  const { locale, league: leagueId } = await params;
  const { challenge } = await searchParams;
  if (!isValidLocale(locale)) notFound();
  if (!(leagueId in FOOTBALL_LEAGUES)) notFound();

  const league = leagueId as FootballLeague;
  const config = FOOTBALL_LEAGUES[league];
  const dict = getDictionary(locale);

  const parsed = challenge ? parseChallengePayload(challenge) : null;
  if (parsed && parsed.sport !== "football") notFound();
  if (parsed?.league && parsed.league !== league) notFound();

  return (
    <SportPlay
      sport="football"
      locale={locale}
      dict={dict}
      players={[]}
      clubs={getFootballClubs(league)}
      eras={getFootballEras(league)}
      league={league}
      brand={config.brand}
      deferPlayerLoad
      challengeSpins={parsed?.spins}
      challengeTargetWins={parsed?.wins}
    />
  );
}
