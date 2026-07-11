"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { PlayerCard } from "@/components/game/PlayerCard";
import { ResultBreakdown } from "@/components/game/ResultBreakdown";
import {
  BasketballMatchResultView,
  FootballMatchResultView,
} from "@/components/game/MatchResultView";
import { ModeSelectOption } from "@/components/game/ModeSelectOption";
import { SportBackdrop } from "@/components/game/SportBackdrop";
import { EdgeHeroes as BbHeroes } from "@/components/basketball/EdgeHeroes";
import { EdgeHeroes as FbHeroes } from "@/components/football/EdgeHeroes";
import { ScoreBug } from "@/components/basketball/ScoreBug";
import { SportThemeProvider } from "@/components/SportThemeProvider";
import { getPlayerPhotoUrl, getSportFallbackPhoto } from "@/lib/assets/player-photos";
import { SPORTS } from "@/lib/config/sports";
import {
  createSandboxState,
  filterSandboxPlayers,
  matchReady,
  peakSandboxPlayers,
  sandboxLineup,
  sandboxReady,
  sandboxReducer,
  type MatchSide,
} from "@/lib/game/sandbox-state";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale, PlayerSeason, SportId } from "@/lib/types";
import { prefetchPlayers } from "@/lib/data/player-fetch";
import { runSimulation } from "@/lib/simulation/run";
import { simulateBasketballMatch } from "@/lib/simulation/match/basketball-match";
import { simulateFootballMatch } from "@/lib/simulation/match/football-match";

interface SandboxClientProps {
  sport: "basketball" | "football";
  locale: Locale;
  dict: Dictionary;
  players: PlayerSeason[];
  playHref: string;
  deferPlayerLoad?: boolean;
  allPlayers?: boolean;
}

function SlotCard({
  sport,
  player,
  position,
  removeLabel,
  onRemove,
  emptyLabel,
}: {
  sport: SportId;
  player: PlayerSeason | null;
  position: string;
  removeLabel: string;
  emptyLabel: string;
  onRemove: () => void;
}) {
  if (!player) {
    return (
      <div className="flex min-h-[72px] flex-col gap-1 rounded-xl border border-dashed border-white/15 bg-black/20 p-2">
        <span className="text-center font-display text-sm text-sport">{position}</span>
        <span className="flex flex-1 items-center justify-center text-[9px] font-bold uppercase tracking-widest text-muted">
          {emptyLabel}
        </span>
      </div>
    );
  }

  const photo =
    getPlayerPhotoUrl(sport, player.name) ?? getSportFallbackPhoto(sport);
  const statKeys =
    sport === "basketball"
      ? (["ppg", "rpg", "apg"] as const)
      : (["goals", "assists", "rating"] as const);

  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-black/30 p-2 overflow-hidden">
      <span className="text-center font-display text-sm text-sport truncate">{position}</span>
      <div className="flex items-center gap-2">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/15 bg-black/60">
          <Image
            src={photo}
            alt=""
            fill
            className="portrait-cutout object-cover object-top"
            sizes="36px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-bold uppercase tracking-wide text-text">
            {player.name}
          </p>
          <p className="truncate text-[9px] text-muted">
            {player.club} · {player.era}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {statKeys.map((key) => (
          <div key={key} className="rounded bg-black/20 py-1 text-center">
            <span className="block text-[7px] font-bold uppercase text-muted/70">
              {key.slice(0, 3)}
            </span>
            <span className="font-display text-[11px] tabular-nums text-text">
              {key === "rating"
                ? String(player.rating)
                : (player.stats[key]?.toFixed(key === "ppg" || key === "goals" ? 0 : 1) ?? "0")}
            </span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="text-[9px] font-black uppercase tracking-widest text-red-400/80 hover:text-red-300"
        onClick={onRemove}
      >
        {removeLabel}
      </button>
    </div>
  );
}

function TeamGrid({
  sport,
  slots,
  positions,
  side,
  label,
  active,
  onActivate,
  onRemove,
  emptyLabel,
  removeLabel,
}: {
  sport: SportId;
  slots: (PlayerSeason | null)[];
  positions: string[];
  side: MatchSide;
  label: string;
  active: boolean;
  onActivate: () => void;
  onRemove: (index: number) => void;
  emptyLabel: string;
  removeLabel: string;
}) {
  const filled = slots.filter(Boolean).length;
  return (
    <div
      className={`rounded-2xl border p-3 transition-colors ${
        active ? "border-sport/50 bg-sport/5" : "border-white/10 bg-black/20"
      }`}
    >
      <button
        type="button"
        className="mb-3 flex w-full items-center justify-between gap-2 text-left"
        onClick={onActivate}
      >
        <span className="font-display text-lg tracking-widest text-sport">{label}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted">
          {filled}/{positions.length}
          {active ? " · editing" : ""}
        </span>
      </button>
      <div
        className={`grid gap-2 ${
          sport === "football"
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        }`}
      >
        {slots.map((player, i) => (
          <SlotCard
            key={`${side}-${positions[i]}-${i}`}
            sport={sport}
            player={player}
            position={positions[i]!}
            emptyLabel={emptyLabel}
            removeLabel={removeLabel}
            onRemove={() => onRemove(i)}
          />
        ))}
      </div>
    </div>
  );
}

export function SandboxClient({
  sport,
  locale,
  dict,
  players: initialPlayers,
  playHref,
  deferPlayerLoad = false,
  allPlayers = false,
}: SandboxClientProps) {
  const sb = dict.sandbox;
  const [players, setPlayers] = useState(
    deferPlayerLoad ? [] : initialPlayers,
  );
  const [playersReady, setPlayersReady] = useState(
    !deferPlayerLoad && initialPlayers.length > 0,
  );

  useEffect(() => {
    if (!deferPlayerLoad) return;
    let cancelled = false;
    void prefetchPlayers(sport, undefined, allPlayers)
      .then((data) => {
        if (cancelled) return;
        setPlayers(data.players);
        setPlayersReady(true);
      })
      .catch(() => {
        if (!cancelled) setPlayersReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, [deferPlayerLoad, allPlayers, sport]);

  const [state, dispatch] = useReducer(
    sandboxReducer,
    undefined,
    () =>
      createSandboxState(
        sport,
        sb.home,
        sb.away,
      ),
  );

  const positions = SPORTS[sport].positions;
  const homeLineup = useMemo(() => sandboxLineup(state.homeSlots), [state.homeSlots]);
  const awayLineup = useMemo(() => sandboxLineup(state.awaySlots), [state.awaySlots]);

  const used = useMemo(() => {
    const ids = new Set(homeLineup.map((p) => p.id));
    if (state.submode === "match") {
      for (const p of awayLineup) ids.add(p.id);
    }
    return ids;
  }, [homeLineup, awayLineup, state.submode]);

  const searchPool = useMemo(
    () => (sport === "basketball" ? peakSandboxPlayers(players) : players),
    [players, sport],
  );

  const matches = useMemo(
    () => filterSandboxPlayers(sport, searchPool, state.search, used),
    [sport, searchPool, state.search, used],
  );

  const lineupOk = sandboxReady(state.homeSlots);
  const matchOk = matchReady(state);
  const canSim =
    state.submode === "lineup" ? lineupOk : state.submode === "match" ? matchOk : false;

  const simulate = useCallback(async () => {
    if (!canSim || !state.submode) return;
    dispatch({ type: "SIMULATE_START" });
    try {
      if (state.submode === "lineup") {
        const result = runSimulation(
          sport,
          homeLineup,
          undefined,
          undefined,
          positions,
        );
        dispatch({ type: "SIMULATE_SEASON_SUCCESS", result });
        return;
      }

      const result =
        sport === "basketball"
          ? simulateBasketballMatch(homeLineup, awayLineup, {
              homeSlots: positions,
              awaySlots: positions,
              homeLabel: state.homeLabel,
              awayLabel: state.awayLabel,
            })
          : simulateFootballMatch(homeLineup, awayLineup, {
              homeSlots: positions,
              awaySlots: positions,
              homeLabel: state.homeLabel,
              awayLabel: state.awayLabel,
            });
      dispatch({ type: "SIMULATE_MATCH_SUCCESS", result });
    } catch (e) {
      dispatch({
        type: "SIMULATE_ERROR",
        error: e instanceof Error ? e.message : "Simulation failed",
      });
    }
  }, [
    canSim,
    state.submode,
    state.homeLabel,
    state.awayLabel,
    sport,
    homeLineup,
    awayLineup,
    positions,
  ]);

  const Heroes = sport === "basketball" ? BbHeroes : FbHeroes;
  const filledCount =
    state.submode === "match"
      ? homeLineup.length + awayLineup.length
      : homeLineup.length;
  const rosterTarget =
    state.submode === "match" ? positions.length * 2 : positions.length;

  return (
    <SportThemeProvider sport={sport}>
      <Heroes phase={state.phase === "result" ? "result" : "draft"} />
      <SportBackdrop sport={sport} className="min-h-screen">
        <div className="page-shell relative z-10 mx-auto flex min-w-0 max-w-5xl flex-col gap-5 py-6 sm:gap-6 sm:py-10">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-display text-3xl tracking-tight text-sport sm:text-5xl">
                {sb.title.toUpperCase()}
              </h1>
              <p className="mt-1 text-xs text-muted sm:text-sm">{sb.subtitle}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Link
                href={playHref}
                className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-sport"
              >
                {dict.play} →
              </Link>
              {state.submode && (
                <button
                  type="button"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-sport"
                  onClick={() => dispatch({ type: "BACK_TO_SUBMODE" })}
                >
                  ← {sb.modesTitle}
                </button>
              )}
            </div>
          </div>

          {state.phase === "submode" && (
            <div className="grid gap-3 sm:gap-4">
              <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                {sb.modesTitle}
              </p>
              <ModeSelectOption
                variant="primary"
                title={sb.lineupMode.toUpperCase()}
                description={sb.lineupDesc}
                onClick={() => dispatch({ type: "SET_SUBMODE", submode: "lineup" })}
              />
              <ModeSelectOption
                variant="secondary"
                title={sb.matchMode.toUpperCase()}
                description={sb.matchDesc}
                onClick={() => dispatch({ type: "SET_SUBMODE", submode: "match" })}
              />
            </div>
          )}

          {state.submode && state.phase !== "submode" && !playersReady && (
            <p className="text-center text-xs font-bold uppercase tracking-widest text-muted">
              {locale === "ru" ? "Загрузка игроков…" : "Loading players…"}
            </p>
          )}

          {state.submode && state.phase !== "submode" && (
            <ScoreBug
              round={filledCount}
              rosterSize={rosterTarget}
              mode="sandbox"
              labelRound={dict.round}
              labelMode={
                state.submode === "match" ? sb.matchMode : sb.lineupMode
              }
            />
          )}

          {state.submode === "lineup" && state.phase !== "result" && (
            <TeamGrid
              sport={sport}
              slots={state.homeSlots}
              positions={positions}
              side="home"
              label={sb.yourLineup}
              active
              onActivate={() => undefined}
              onRemove={(i) => dispatch({ type: "REMOVE_SLOT", side: "home", index: i })}
              emptyLabel={sb.empty}
              removeLabel={sb.remove}
            />
          )}

          {state.submode === "match" && state.phase !== "result" && (
            <div className="flex flex-col gap-4">
              <TeamGrid
                sport={sport}
                slots={state.homeSlots}
                positions={positions}
                side="home"
                label={state.homeLabel}
                active={state.activeSide === "home"}
                onActivate={() => dispatch({ type: "SET_ACTIVE_SIDE", side: "home" })}
                onRemove={(i) => dispatch({ type: "REMOVE_SLOT", side: "home", index: i })}
                emptyLabel={sb.empty}
                removeLabel={sb.remove}
              />
              <TeamGrid
                sport={sport}
                slots={state.awaySlots}
                positions={positions}
                side="away"
                label={state.awayLabel}
                active={state.activeSide === "away"}
                onActivate={() => dispatch({ type: "SET_ACTIVE_SIDE", side: "away" })}
                onRemove={(i) => dispatch({ type: "REMOVE_SLOT", side: "away", index: i })}
                emptyLabel={sb.empty}
                removeLabel={sb.remove}
              />
            </div>
          )}

          {state.submode && state.phase !== "result" && playersReady && (
            <>
              <input
                type="search"
                value={state.search}
                onChange={(e) =>
                  dispatch({ type: "SET_SEARCH", query: e.target.value })
                }
                placeholder={sb.searchPlaceholder}
                className="w-full min-w-0 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-text placeholder:text-muted focus:border-sport focus:outline-none sm:text-sm"
              />
              {state.error && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  {state.error}
                </p>
              )}
              {matches.length > 0 && (
                <div className="max-h-[min(40vh,320px)] overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-2 custom-scrollbar">
                  {matches.map((p) => (
                    <PlayerCard
                      key={p.id}
                      player={p}
                      variant="row"
                      statsHidden={dict.statsHidden}
                      onSelect={() => dispatch({ type: "ADD_PLAYER", player: p })}
                    />
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={!canSim || state.phase === "simulating"}
                  className="flex-1 rounded-xl bg-sport py-4 font-display text-lg tracking-widest text-bg disabled:cursor-not-allowed disabled:opacity-40 sm:text-xl"
                  onClick={() => void simulate()}
                >
                  {state.phase === "simulating"
                    ? dict.analyzing
                    : state.submode === "match"
                      ? sb.simulateMatch.toUpperCase()
                      : sb.simulate.toUpperCase()}
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-white/15 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted hover:text-text sm:shrink-0"
                  onClick={() => dispatch({ type: "CLEAR_ALL" })}
                >
                  {sb.clear}
                </button>
              </div>
            </>
          )}

          {state.phase === "result" && state.seasonResult && (
            <div className="flex flex-col gap-6">
              <ResultBreakdown
                result={state.seasonResult}
                dict={dict}
                sport={sport}
              />
              <button
                type="button"
                className="rounded-xl border border-border bg-surface py-4 font-display text-lg tracking-widest text-text sm:text-xl"
                onClick={() => dispatch({ type: "RESET" })}
              >
                {dict.playAgain.toUpperCase()}
              </button>
            </div>
          )}

          {state.phase === "result" && state.matchResult && (
            <div className="flex flex-col gap-6">
              {state.matchResult.sport === "basketball" ? (
                <BasketballMatchResultView result={state.matchResult} dict={dict} />
              ) : (
                <FootballMatchResultView result={state.matchResult} dict={dict} />
              )}
              <button
                type="button"
                className="rounded-xl border border-border bg-surface py-4 font-display text-lg tracking-widest text-text sm:text-xl"
                onClick={() => dispatch({ type: "RESET" })}
              >
                {dict.playAgain.toUpperCase()}
              </button>
            </div>
          )}
        </div>
      </SportBackdrop>
    </SportThemeProvider>
  );
}
