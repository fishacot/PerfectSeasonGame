import { notFound } from "next/navigation";
import { SportPlay } from "@/components/game/SportPlay";
import { SPORTS } from "@/lib/config/sports";
import { NBA_CLUBS } from "@/lib/config/leagues/basketball";
import { getErasForSport } from "@/lib/config/eras";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";

/** Challenge query (?challenge=) is parsed client-side in GameClient when present. */
export default async function BasketballPlayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);

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
    />
  );
}
