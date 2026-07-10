"use client";

import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { SandboxShell } from "@/components/game/SandboxShell";
import { prefetchPlayers } from "@/lib/data/player-fetch";

type SandboxClientProps = ComponentProps<
  typeof import("@/components/game/SandboxClient").SandboxClient
>;

type SportSandboxProps = SandboxClientProps & {
  deferPlayerLoad?: boolean;
  /** Football sandbox needs the full cross-league pool. */
  allPlayers?: boolean;
};

/** Thin entry: instant shell + lazy sandbox bundle + parallel player prefetch. */
export function SportSandbox({
  deferPlayerLoad,
  allPlayers = false,
  ...props
}: SportSandboxProps) {
  const [SandboxClient, setSandboxClient] = useState<
    typeof import("@/components/game/SandboxClient").SandboxClient | null
  >(null);

  useEffect(() => {
    if (deferPlayerLoad) {
      void prefetchPlayers(props.sport, undefined, allPlayers);
    }
    void import("@/components/game/SandboxClient").then((mod) => {
      setSandboxClient(() => mod.SandboxClient);
    });
  }, [deferPlayerLoad, allPlayers, props.sport]);

  if (!SandboxClient) {
    return (
      <SandboxShell
        sport={props.sport}
        locale={props.locale}
        dict={props.dict}
        playHref={props.playHref}
      />
    );
  }

  return (
    <SandboxClient
      {...props}
      deferPlayerLoad={deferPlayerLoad}
      allPlayers={allPlayers}
      players={props.players ?? []}
    />
  );
}
