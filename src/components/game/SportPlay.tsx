"use client";

import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { SportModeSelectShell } from "@/components/game/SportModeSelectShell";
import { prefetchPlayers } from "@/lib/data/player-fetch";
import type { PlayerSeason } from "@/lib/types";

type GameClientProps = ComponentProps<
  typeof import("@/components/game/GameClient").GameClient
>;

type SportPlayProps = GameClientProps & {
  deferPlayerLoad?: boolean;
};

/** Thin entry: instant shell + lazy game bundle + parallel player prefetch. */
export function SportPlay({ deferPlayerLoad, ...props }: SportPlayProps) {
  const [GameClient, setGameClient] = useState<
    typeof import("@/components/game/GameClient").GameClient | null
  >(null);
  const [poolPlayers, setPoolPlayers] = useState<PlayerSeason[]>(
    deferPlayerLoad ? [] : props.players,
  );
  const [poolClubs, setPoolClubs] = useState<string[]>(props.clubs);

  useEffect(() => {
    if (!deferPlayerLoad) return;
    void prefetchPlayers(props.sport, props.league).then((data) => {
      setPoolPlayers(data.players);
      setPoolClubs(data.clubs);
    });
    void import("@/components/game/GameClient").then((mod) => {
      setGameClient(() => mod.GameClient);
    });
  }, [deferPlayerLoad, props.sport, props.league]);

  useEffect(() => {
    if (deferPlayerLoad) return;
    void import("@/components/game/GameClient").then((mod) => {
      setGameClient(() => mod.GameClient);
    });
  }, [deferPlayerLoad]);

  if (!GameClient) {
    return (
      <SportModeSelectShell
        sport={props.sport}
        locale={props.locale}
        dict={props.dict}
        brand={props.brand}
      />
    );
  }

  const playersLoaded = poolPlayers.length > 0;

  return (
    <GameClient
      {...props}
      clubs={poolClubs}
      players={poolPlayers}
      deferPlayerLoad={deferPlayerLoad && !playersLoaded}
    />
  );
}
