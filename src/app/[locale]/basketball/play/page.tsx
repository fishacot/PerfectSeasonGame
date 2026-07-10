import { notFound } from "next/navigation";
import { SportPlay } from "@/components/game/SportPlay";
import { SPORTS } from "@/lib/config/sports";
import { NBA_CLUBS } from "@/lib/config/leagues/basketball";
import { getErasForSport } from "@/lib/config/eras";
import { parseChallengePayload } from "@/lib/game/challenge";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";

export default async function BasketballPlayPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ challenge?: string }>;
}) {
  const { locale } = await params;
  const { challenge } = await searchParams;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const parsed = challenge ? parseChallengePayload(challenge) : null;
  if (parsed && parsed.sport !== "basketball") notFound();

  return (
    <SportPlay
      sport="basketball"
      locale={locale}
      dict={dict}
      players={[]}
      clubs={[...NBA_CLUBS]}
      eras={getErasForSport("basketball")}
      brand={SPORTS.basketball.brand}
      deferPlayerLoad
      challengeSpins={parsed?.spins}
      challengeTargetWins={parsed?.wins}
    />
  );
}
