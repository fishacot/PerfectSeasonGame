import { notFound } from "next/navigation";
import { GameClient } from "@/components/game/GameClient";
import { SPORTS } from "@/lib/config/sports";
import { getErasForSport } from "@/lib/config/eras";
import { parseChallengePayload } from "@/lib/game/challenge";
import {
  loadBasketballPlayers,
  getNbaClubs,
} from "@/lib/data/loaders";
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
    <GameClient
      sport="basketball"
      locale={locale}
      dict={dict}
      players={loadBasketballPlayers()}
      clubs={getNbaClubs()}
      eras={getErasForSport("basketball")}
      brand={SPORTS.basketball.brand}
      challengeSpins={parsed?.spins}
      challengeTargetWins={parsed?.wins}
    />
  );
}
