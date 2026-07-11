import { notFound } from "next/navigation";
import { LiveRoomStatus } from "@/components/friends/LiveRoomStatus";
import { SportPlay } from "@/components/game/SportPlay";
import { SPORTS } from "@/lib/config/sports";
import { NBA_CLUBS } from "@/lib/config/leagues/basketball";
import { getErasForSport } from "@/lib/config/eras";
import { loadBasketballPlayers } from "@/lib/data/loaders";
import { getMatchSpins } from "@/lib/game/spin";
import { getDictionary, isValidLocale } from "@/lib/i18n/dictionaries";

export function generateStaticParams() {
  // Static export needs fixed room ids; live lobby can deep-link later.
  return [{ roomId: "local" }];
}

export default async function BasketballLiveRoomPage({
  params,
}: {
  params: Promise<{ locale: string; roomId: string }>;
}) {
  const { locale, roomId } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const spins = getMatchSpins(
    "basketball",
    `room:${roomId}`,
    SPORTS.basketball.rosterSize,
    [...NBA_CLUBS],
    getErasForSport("basketball"),
    loadBasketballPlayers(),
    SPORTS.basketball.positions,
  );

  return (
    <>
      <LiveRoomStatus roomId={roomId} locale={locale} />
      <SportPlay
        sport="basketball"
        locale={locale}
        dict={dict}
        players={[]}
        clubs={[...NBA_CLUBS]}
        eras={getErasForSport("basketball")}
        brand={`${SPORTS.basketball.brand} · ROOM ${roomId}`}
        deferPlayerLoad
        challengeSpins={spins}
      />
    </>
  );
}
