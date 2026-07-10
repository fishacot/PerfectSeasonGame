"use client";

import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { SportModeSelectShell } from "@/components/game/SportModeSelectShell";
import { prefetchPlayers } from "@/lib/data/player-fetch";

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

  useEffect(() => {
    if (deferPlayerLoad) {
      void prefetchPlayers(props.sport, props.league);
    }
    void import("@/components/game/GameClient").then((mod) => {
      setGameClient(() => mod.GameClient);
    });
  }, [deferPlayerLoad, props.sport, props.league]);

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

  return (
    <GameClient {...props} deferPlayerLoad={deferPlayerLoad} players={props.players ?? []} />
  );
}
