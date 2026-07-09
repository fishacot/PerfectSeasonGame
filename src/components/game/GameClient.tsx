"use client";

import Link from "next/link";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";
import { EraTracker } from "@/components/game/EraTracker";
import { PlayerCard } from "@/components/game/PlayerCard";
import { PlayerPoolList } from "@/components/game/PlayerPoolList";
import { LineupBoard } from "@/components/game/LineupBoard";
import { SkipChips } from "@/components/game/SkipChips";
import { ResultBreakdown } from "@/components/game/ResultBreakdown";
import { FinalRoster } from "@/components/game/FinalRoster";
import { recordDailyBest } from "@/components/game/DailyLeaderboardStub";
import { VersusPanel } from "@/components/game/VersusPanel";
import { VersusResult } from "@/components/game/VersusResult";
import { ShareCard } from "@/components/game/ShareCard";
import { SlotMachine } from "@/components/game/SlotMachine";
import { PhasePanel } from "@/components/game/PhasePanel";
import { SportThemeProvider } from "@/components/SportThemeProvider";
import { createInitialState, draftReducer } from "@/lib/game/draft-state";
import { makeChallengeUrl } from "@/lib/game/challenge";
import {
  getDailyAttempt,
  saveDailyAttempt,
  type DailyAttempt,
} from "@/lib/game/daily-attempt";
import { getOpenSlotKeys, canPlaceAtPosition, filterPickablePlayers } from "@/lib/game/validation";
import { SPIN_CLUB_MS, SPIN_ERA_MS, SPIN_GAP_MS } from "@/lib/game/spin-timing";
import { SPORTS } from "@/lib/config/sports";
import {
  FORMATION_IDS,
  getFormationLabel,
  getFormationPositions,
  type FormationId,
} from "@/lib/config/formations";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type {
  Era,
  FootballDifficulty,
  FootballLeague,
  GameMode,
  Locale,
  PlayerSeason,
  SportId,
  SpinResult,
} from "@/lib/types";

import { ModeSelectOption } from "@/components/game/ModeSelectOption";
import { Zap } from "lucide-react";
import { SportBackdrop } from "@/components/game/SportBackdrop";
import { EdgeHeroes as BasketballEdgeHeroes } from "@/components/basketball/EdgeHeroes";
import { EdgeHeroes as FootballEdgeHeroes } from "@/components/football/EdgeHeroes";
import { ScoreBug } from "@/components/basketball/ScoreBug";

interface GameClientProps {
  sport: SportId;
  locale: Locale;
  dict: Dictionary;
  players: PlayerSeason[];
  clubs: string[];
  eras: readonly Era[];
  league?: FootballLeague;
  brand: string;
  initialMode?: GameMode;
  dailySpins?: SpinResult[];
  challengeSpins?: SpinResult[];
  challengeTargetWins?: number;
}

export function GameClient({
  sport,
  locale,
  dict,
  players,
  clubs,
  eras,
  league,
  brand,
  initialMode = "classic",
  dailySpins,
  challengeSpins,
  challengeTargetWins,
}: GameClientProps) {
  const router = useRouter();
  const [displayWins, setDisplayWins] = useState<number | null>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const [spinAnimating, setSpinAnimating] = useState(false);
  const [spinStage, setSpinStage] = useState<"idle" | "club" | "era">("idle");
  const [dailyAttempt, setDailyAttempt] = useState<DailyAttempt | null>(null);
  const [copyDone, setCopyDone] = useState(false);
  const [simError, setSimError] = useState<string | null>(null);
  const [formationId, setFormationId] = useState<FormationId>("433");
  const [cpuSpinning, setCpuSpinning] = useState(false);
  const poolAnchorRef = useRef<HTMLDivElement>(null);
  const config = SPORTS[sport];
  const slotPositions =
    sport === "football"
      ? getFormationPositions(formationId)
      : config.positions;

  const [state, dispatch] = useReducer(
    draftReducer,
    createInitialState(sport, config.rosterSize, clubs, eras, players, league),
  );

  useEffect(() => {
    setDailyAttempt(getDailyAttempt(sport, league));
  }, [sport, league]);

  useEffect(() => {
    if (challengeSpins?.length) {
      dispatch({ type: "SET_MODE", mode: "classic" });
      dispatch({ type: "START", dailySpins: challengeSpins });
      return;
    }
    if (initialMode === "daily" && dailySpins) {
      dispatch({ type: "SET_MODE", mode: "daily" });
      dispatch({ type: "START", dailySpins });
    } else if (initialMode === "blind") {
      dispatch({ type: "SET_MODE", mode: "blind" });
    } else if (initialMode === "classic") {
      dispatch({ type: "SET_MODE", mode: "classic" });
    }
  }, [initialMode, dailySpins, challengeSpins]);

  const isVersusDaily = state.mode === "daily" && !challengeSpins?.length;

  const simulate = useCallback(async () => {
    const lineup = Array.from(state.lineup.values());
    setSimError(null);

    const runSim = async (
      players: PlayerSeason[],
      lineupMap?: Map<string, PlayerSeason>,
    ) => {
      const map = lineupMap ?? state.lineup;
      const entries = Array.from(map.entries());
      const slotLabels =
        sport === "football" && entries.length === players.length
          ? entries.map(([k]) => k.split(":")[0] ?? k)
          : undefined;
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport,
          league,
          lineup: players,
          slotLabels,
        }),
      });
      if (!res.ok) return null;
      return res.json();
    };

    if (isVersusDaily) {
      const botLineup = Array.from(state.opponentLineup.values());
      const [userResult, botResult] = await Promise.all([
        runSim(lineup, state.lineup),
        runSim(botLineup, state.opponentLineup),
      ]);
      if (!userResult || !botResult) {
        setSimError(dict.invalidLineup);
        return;
      }
      dispatch({ type: "SET_VERSUS_RESULTS", user: userResult, bot: botResult });

      const userWon = userResult.wins > botResult.wins;
      if (userWon) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#fbbf24", "#ffffff", "#ff9100"],
        });
      }

      const attempt: DailyAttempt = {
        wins: userResult.wins,
        losses: userResult.losses,
        maxWins: userResult.maxWins,
        botWins: botResult.wins,
        userWon,
        at: Date.now(),
      };
      saveDailyAttempt(sport, league, attempt);
      recordDailyBest(sport, userResult.wins);
      setDailyAttempt(attempt);
      return;
    }

    const result = await runSim(lineup);
    if (!result) {
      setSimError(dict.invalidLineup);
      return;
    }
    dispatch({ type: "SET_RESULT", result });

    if (result.perfect) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#ffffff", sport === "football" ? "#00e676" : sport === "basketball" ? "#ff9100" : "#00b0ff"]
      });
    }

    const key = `psh-${sport}-${league ?? "all"}`;
    const history = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[];
    history.unshift({ wins: result.wins, max: result.maxWins, at: Date.now() });
    localStorage.setItem(key, JSON.stringify(history.slice(0, 10)));

    if (state.mode === "daily") {
      const attempt: DailyAttempt = {
        wins: result.wins,
        losses: result.losses,
        maxWins: result.maxWins,
        at: Date.now(),
      };
      saveDailyAttempt(sport, league, attempt);
      setDailyAttempt(attempt);
    }
  }, [
    state.lineup,
    state.opponentLineup,
    state.mode,
    isVersusDaily,
    sport,
    league,
    dict.invalidLineup,
  ]);

  useEffect(() => {
    if (state.mode !== "daily" || state.phase !== "opponent-draft") return;
    setCpuSpinning(true);
    const spinEnd = window.setTimeout(() => setCpuSpinning(false), 1000);
    const pickTimer = window.setTimeout(() => {
      dispatch({ type: "BOT_PICK", positions: slotPositions });
    }, 1500);
    return () => {
      window.clearTimeout(spinEnd);
      window.clearTimeout(pickTimer);
    };
  }, [state.mode, state.phase, state.picks.length, slotPositions]);

  useEffect(() => {
    if (sport !== "basketball" || state.phase !== "picking") return;
    poolAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [sport, state.phase, state.round]);

  useEffect(() => {
    if (state.phase !== "result" || !state.result) {
      setDisplayWins(null);
      return;
    }
    setDisplayWins(state.result.wins);
  }, [state.phase, state.result]);

  useEffect(() => {
    if (state.phase === "simulating") {
      void simulate();
    }
  }, [state.phase, simulate]);

  const handleShare = async () => {
    if (!shareRef.current || !state.result) return;
    const dataUrl = await toPng(shareRef.current, { pixelRatio: 1 });
    const text = `${brand}: ${state.result.wins}-${state.result.losses}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `${brand}-result.png`, { type: "image/png" });
        await navigator.share({ title: brand, text, files: [file] });
        return;
      } catch {
        /* fall through to download */
      }
    }
    const link = document.createElement("a");
    link.download = `${brand}-result.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleCopyChallenge = () => {
    const path =
      sport === "football" && league
        ? `/${locale}/football/${league}/play`
        : `/${locale}/${sport}/play`;
    const url = makeChallengeUrl(window.location.origin, path, {
      sport,
      league,
      spins: state.spins,
      wins: state.result?.wins,
    });
    void navigator.clipboard.writeText(url);
    setCopyDone(true);
    window.setTimeout(() => setCopyDone(false), 2500);
  };

  const handlePick = useCallback((player: PlayerSeason) => {
    dispatch({ type: "PICK", player });
  }, []);

  const runSpin = useCallback(
    (openLabels: string[]) => {
      setSpinAnimating(true);
      setSpinStage("club");
      window.setTimeout(() => {
        setSpinStage("era");
        window.setTimeout(() => {
          dispatch({ type: "SPIN", openSlotLabels: openLabels });
          setSpinAnimating(false);
          setSpinStage("idle");
        }, SPIN_ERA_MS);
      }, SPIN_CLUB_MS + SPIN_GAP_MS);
    },
    [],
  );

  const runSkip = useCallback(
    (target: "team" | "era", openLabels: string[]) => {
      setSpinAnimating(true);
      setSpinStage(target === "team" ? "club" : "era");
      const duration = target === "team" ? SPIN_CLUB_MS : SPIN_ERA_MS;
      window.setTimeout(() => {
        dispatch({
          type: target === "team" ? "SKIP_TEAM" : "SKIP_ERA",
          openSlotLabels: openLabels,
        });
        setSpinAnimating(false);
        setSpinStage("idle");
      }, duration);
    },
    [],
  );

  if (state.phase === "mode-select") {
    const dailyDesc = dailyAttempt
      ? dailyAttempt.botWins != null
        ? `${dict.dailyCompleted} · ${dict.versusScoreLine
            .replace("{you}", String(dailyAttempt.wins))
            .replace("{cpu}", String(dailyAttempt.botWins))}`
        : `${dict.dailyCompleted} · ${dict.dailyYourScore}: ${dailyAttempt.wins}-${dailyAttempt.maxWins - dailyAttempt.wins}`
      : sport === "basketball"
        ? dict.basketball.dailyDesc
        : sport === "football"
          ? dict.football.dailyDesc
          : dict.dailySubtitle;

    const modeContent = (
      <div className="page-shell mx-auto flex max-w-lg flex-col gap-5 py-6 sm:gap-8 sm:py-10 lg:max-w-xl">
          <div className="text-center">
            <h1 className="page-title text-sport drop-shadow-[0_0_20px_var(--sport-glow)]">
              {brand.toUpperCase()}
            </h1>
            <p className="page-subtitle mt-2 font-medium uppercase text-muted">
              {dict.tagline}
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4">
            {sport === "football" && (
              <div className="overflow-hidden rounded-lg border border-white/15 bg-[#0a1428]/90 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md">
                <p className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                  {dict.formation}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {FORMATION_IDS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      className={`rounded-xl py-3 font-display text-lg tracking-widest transition-all ${
                        formationId === id
                          ? "bg-sport text-bg glow-sport"
                          : "border border-white/10 text-muted hover:border-sport/40 hover:text-text"
                      }`}
                      onClick={() => setFormationId(id)}
                    >
                      {getFormationLabel(id)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sport === "football" && (
              <div className="overflow-hidden rounded-lg border border-white/15 bg-[#0a1428]/90 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md">
                <p className="mb-1 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                  {dict.difficulty}
                </p>
                <p className="mb-3 text-center text-[9px] text-muted/80">
                  {dict.footballHardHint}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(["easy", "normal", "hard"] as FootballDifficulty[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={`rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                        state.difficulty === d
                          ? "bg-sport text-bg glow-sport"
                          : "border border-white/10 text-muted hover:border-sport/40 hover:text-text"
                      }`}
                      onClick={() => dispatch({ type: "SET_DIFFICULTY", difficulty: d })}
                    >
                      {dict.difficulties[d]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(sport === "basketball" || sport === "football") && (
              <p className="text-center text-xs leading-relaxed text-muted">
                {sport === "basketball"
                  ? dict.basketball.modeSelectHint
                  : dict.football.modeSelectHint}
              </p>
            )}

            <ModeSelectOption
              variant="primary"
              title={dict.classic.toUpperCase()}
              description={
                sport === "basketball"
                  ? dict.basketball.classicDesc
                  : sport === "football"
                    ? dict.football.classicDesc
                    : dict.classicSubtitle
              }
              onClick={() => {
                dispatch({ type: "SET_MODE", mode: "classic" });
                dispatch({ type: "START" });
              }}
            />

            <ModeSelectOption
              variant="secondary"
              title={dict.blind.toUpperCase()}
              description={
                sport === "basketball"
                  ? dict.basketball.hoopiqDesc
                  : sport === "football"
                    ? dict.football.hoopiqDesc
                    : dict.blindSubtitle
              }
              onClick={() => {
                dispatch({ type: "SET_MODE", mode: "blind" });
                dispatch({ type: "START" });
              }}
            />

            <ModeSelectOption
              variant="daily"
              title={dict.daily.toUpperCase()}
              description={dailyDesc}
              disabled={!!dailyAttempt}
              onClick={async () => {
                if (dailyAttempt) return;
                const q = league ? `&league=${league}` : "";
                const fq =
                  sport === "football" ? `&formation=${formationId}` : "";
                const res = await fetch(
                  `/api/daily?sport=${sport}${q}${fq}`,
                );
                const data = await res.json();
                dispatch({ type: "SET_MODE", mode: "daily" });
                dispatch({ type: "START", dailySpins: data.spins });
              }}
            />

            {(sport === "basketball" || sport === "football") && (
              <ModeSelectOption
                variant="secondary"
                title={dict.sandbox.title.toUpperCase()}
                description={dict.sandbox.modeCardDesc}
                onClick={() => {
                  router.push(
                    sport === "basketball"
                      ? `/${locale}/basketball/sandbox`
                      : `/${locale}/football/sandbox`,
                  );
                }}
              />
            )}
          </div>
          
          <div className="mt-4 flex flex-col items-center gap-3 sm:mt-6 sm:gap-4">
            <div className="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-center backdrop-blur-sm sm:p-6">
              <p className="text-xs leading-relaxed text-muted italic">
                "{dict.hubQuote}"
              </p>
            </div>
            <Link
              href={`/${locale}/how-to-play`}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-sport"
            >
              {dict.howToPlay} →
            </Link>
          </div>
        </div>
    );

    return (
      <SportThemeProvider sport={sport}>
        {sport === "basketball" || sport === "football" ? (
          <>
            {sport === "basketball" ? (
              <BasketballEdgeHeroes phase="mode-select" />
            ) : (
              <FootballEdgeHeroes phase="mode-select" />
            )}
            <SportBackdrop sport={sport} className="min-h-screen">{modeContent}</SportBackdrop>
          </>
        ) : (
          modeContent
        )}
      </SportThemeProvider>
    );
  }

  if (state.phase === "result" && state.result) {
    const lineupPlayers = Array.from(state.lineup.values());
    const versus = isVersusDaily && state.botResult != null;
    const botResult = state.botResult;
    const resultContent = (
        <div
          className={`mx-auto flex flex-col gap-6 px-4 py-6 sm:gap-8 sm:p-6 sm:py-8 ${
            versus ? "max-w-5xl" : sport === "basketball" || sport === "football" ? "max-w-2xl" : "max-w-lg"
          }`}
        >
          <div className="text-center">
            <h2 className="font-display text-3xl tracking-tight text-sport sm:text-4xl">
              {(versus ? dict.versusOutcome : dict.seasonComplete).toUpperCase()}
            </h2>
            <p className="micro-label text-muted mt-1">{dict.finalAnalysis}</p>
          </div>

          {versus && botResult ? (
            <VersusResult
              sport={sport}
              userResult={state.result}
              botResult={botResult}
              dict={dict}
            />
          ) : (
            <>
              <ResultBreakdown
                result={state.result}
                dict={dict}
                sport={sport}
                displayWins={displayWins}
              />
              {lineupPlayers.length > 0 && (
                <FinalRoster
                  sport={sport}
                  lineup={state.lineup}
                  picks={state.picks}
                  dict={dict}
                  positions={
                    sport === "football" ? slotPositions : undefined
                  }
                  formationLabel={
                    sport === "football" ? getFormationLabel(formationId) : undefined
                  }
                />
              )}
            </>
          )}
          
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <button
              type="button"
              className="rounded-lg bg-sport py-4 font-display text-xl tracking-widest text-bg transition-colors hover:glow-sport"
              onClick={() => void handleShare()}
            >
              {dict.share.toUpperCase()}
            </button>
            <button
              type="button"
              className="rounded-lg border border-border bg-surface py-4 font-display text-xl tracking-widest text-text transition-colors hover:border-sport/50"
              onClick={() => dispatch({ type: "RESET" })}
            >
              {dict.playAgain.toUpperCase()}
            </button>
          </div>

          {typeof window !== "undefined" && state.result && (
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `${brand}: ${state.result.wins}-${state.result.losses} ${dict.share.toUpperCase()}`,
              )}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-white/10 py-3 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-sport"
            >
              Share on X
            </a>
          )}

          <button
            type="button"
            className="rounded-2xl border border-white/5 bg-white/5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted transition-all hover:text-text"
            onClick={handleCopyChallenge}
          >
            {copyDone ? dict.copyChallengeDone : dict.copyChallenge}
          </button>

          <div className="pointer-events-none fixed -left-[9999px] top-0">
            <SportThemeProvider sport={sport}>
              <ShareCard
                ref={shareRef}
                sport={sport}
                locale={locale}
                wins={state.result.wins}
                losses={state.result.losses}
                draws={state.result.draws}
                maxWins={state.result.maxWins}
                eras={lineupPlayers.map((p) => p.era)}
                lineup={lineupPlayers}
                perfect={state.result.perfect}
                labels={{
                  legend: dict.shareLegend,
                  finalRecord: dict.shareFinalRecord,
                  winRate: dict.shareWinRate,
                  points: dict.sharePoints,
                  erasConquered: dict.shareErasConquered,
                  perfectSeason: dict.sharePerfectSeason,
                  hubTag: dict.shareHubTag,
                }}
              />
            </SportThemeProvider>
          </div>
        </div>
    );

    return (
      <SportThemeProvider sport={sport}>
        {sport === "basketball" || sport === "football" ? (
          <>
            {sport === "basketball" ? (
              <BasketballEdgeHeroes phase="result" />
            ) : (
              <FootballEdgeHeroes phase="result" />
            )}
            <SportBackdrop sport={sport} className="min-h-screen">{resultContent}</SportBackdrop>
          </>
        ) : (
          resultContent
        )}
      </SportThemeProvider>
    );
  }

  const openSlots = getOpenSlotKeys(slotPositions, state.lineup);
  const openLabels = openSlots.map((s) => s.label);
  const pickablePlayers = filterPickablePlayers(
    sport,
    state.availablePlayers,
    state.usedEras,
    openLabels,
  );
  const isBasketball = sport === "basketball";
  const isFootball = sport === "football";
  const isBroadcastSport = isBasketball || isFootball;
  const broadcastPicking =
    isBroadcastSport && (state.phase === "picking" || state.phase === "placing");
  const showSlotMachine =
    !isVersusDaily &&
    (state.phase === "spinning" || (spinAnimating && state.phase !== "picking"));
  const clubSpinning = spinAnimating && spinStage === "club";
  const eraSpinning = spinAnimating && spinStage === "era";

  const botThinking = state.phase === "opponent-draft";

  const isSpinningPhase = state.phase === "spinning" || (spinAnimating && state.phase !== "picking");

  const sidebar = isVersusDaily ? (
    <div className="lg:sticky lg:top-24">
      <VersusPanel
        sport={sport}
        dict={dict}
        userLineup={state.lineup}
        opponentLineup={state.opponentLineup}
        currentSpin={state.currentSpin}
        clubs={clubs}
        eras={eras}
        round={state.round}
        rosterSize={config.rosterSize}
        cpuSpinning={cpuSpinning}
        botReveal={state.botReveal}
        botThinking={botThinking}
        positions={sport === "football" ? slotPositions : undefined}
        formationLabel={
          sport === "football" ? getFormationLabel(formationId) : undefined
        }
      />
    </div>
  ) : (
    <div className="flex flex-col gap-6">
      {/* Broadcast sports: hide board in sidebar during picking (moved to pool) and spinning (moved to center) */}
      {(!isBroadcastSport || (!broadcastPicking && !isSpinningPhase)) && (
        <div className={broadcastPicking ? "" : "lg:sticky lg:top-24"}>
          <LineupBoard
            variant={sport}
            lineup={state.lineup}
            positions={sport === "football" ? slotPositions : undefined}
            formationLabel={
              sport === "football" ? getFormationLabel(formationId) : undefined
            }
            onSlotTap={(slotKey) => {
              if (state.phase === "placing") {
                dispatch({ type: "PLACE", slot: slotKey });
              }
            }}
            activeSlot={null}
            placing={state.phase === "placing"}
          />
        </div>
      )}
      {!broadcastPicking && !isSpinningPhase && (
        <EraTracker sport={sport} eras={eras} usedEras={state.usedEras} />
      )}
      {showSlotMachine && !isBroadcastSport && (
        <SlotMachine
          club={state.currentSpin?.club ?? null}
          era={state.currentSpin?.era ?? null}
          clubs={clubs}
          eras={eras}
          isSpinning={spinAnimating && state.phase === "spinning"}
          spinningClub={clubSpinning}
          spinningEra={eraSpinning}
          onSpin={() => {
            if (state.phase !== "spinning" || spinAnimating) return;
            runSpin(openLabels);
          }}
          spinLabel={dict.spin}
          disabled={state.phase !== "spinning" || spinAnimating}
        />
      )}
      {state.mode !== "daily" && !state.dailySpins && (state.phase === "picking" || state.phase === "placing") && !isBroadcastSport && (
        <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-md">
          <SkipChips
            sport={sport}
            skipTeamLabel={dict.skipTeam}
            skipEraLabel={dict.skipEra}
            rerollsLabel={dict.rerolls}
            rerollsRemaining={state.rerollsRemaining}
            skipsUsed={state.skipsUsed}
            onSkipTeam={() => {
              if (spinAnimating) return;
              runSkip("team", openLabels);
            }}
            onSkipEra={() => {
              if (spinAnimating) return;
              runSkip("era", openLabels);
            }}
          />
        </div>
      )}
    </div>
  );

  const playerPanel = (
    <AnimatePresence mode="wait">
      {state.phase === "opponent-draft" && isVersusDaily && (
        <PhasePanel
          key="opponent-draft"
          className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-red-400/20 bg-red-500/5 py-16"
        >
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-red-400/20" />
            <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-red-400 border-t-transparent" />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest text-red-300">
            {dict.versusCpuThinking}
          </p>
        </PhasePanel>
      )}

      {isBroadcastSport && isSpinningPhase && (
        <PhasePanel
          key="spin"
          className="mx-auto flex w-full max-w-md flex-col gap-6"
        >
          <SlotMachine
            club={state.currentSpin?.club ?? null}
            era={state.currentSpin?.era ?? null}
            clubs={clubs}
            eras={eras}
            isSpinning={spinAnimating && state.phase === "spinning"}
            spinningClub={clubSpinning}
            spinningEra={eraSpinning}
            onSpin={() => {
              if (state.phase !== "spinning" || spinAnimating) return;
              runSpin(openLabels);
            }}
            spinLabel={dict.spin}
            disabled={state.phase !== "spinning" || spinAnimating}
          />
          <LineupBoard
            variant={sport}
            lineup={state.lineup}
            positions={isFootball ? slotPositions : undefined}
            formationLabel={
              isFootball ? getFormationLabel(formationId) : undefined
            }
            compact
          />
          <EraTracker sport={sport} eras={eras} usedEras={state.usedEras} />
        </PhasePanel>
      )}

      {state.phase === "picking" && (
        <PhasePanel key="picking" className="flex flex-col gap-4">
          <div ref={poolAnchorRef} className="contents">
          {isBroadcastSport && (
            <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
              <LineupBoard
                variant={sport}
                lineup={state.lineup}
                positions={isFootball ? slotPositions : undefined}
                formationLabel={
                  isFootball ? getFormationLabel(formationId) : undefined
                }
              />
              <div className="w-full max-w-md lg:w-auto lg:min-w-[260px] lg:max-w-xs lg:pt-1">
                <EraTracker sport={sport} eras={eras} usedEras={state.usedEras} />
              </div>
            </div>
          )}
          {isBroadcastSport &&
            state.mode !== "daily" &&
            !state.dailySpins && (
              <div className="rounded-3xl border border-white/5 bg-white/5 p-4 backdrop-blur-md">
                <SkipChips
                  sport={sport}
                  skipTeamLabel={dict.skipTeam}
                  skipEraLabel={dict.skipEra}
                  rerollsLabel={dict.rerolls}
                  rerollsRemaining={state.rerollsRemaining}
                  skipsUsed={state.skipsUsed}
                  onSkipTeam={() => {
                    if (spinAnimating) return;
                    runSkip("team", openLabels);
                  }}
                  onSkipEra={() => {
                    if (spinAnimating) return;
                    runSkip("era", openLabels);
                  }}
                />
              </div>
            )}
            {((sport === "basketball" &&
              state.availablePlayers.length > 0 &&
              state.availablePlayers.length < 52) ||
              (sport === "football" &&
                state.availablePlayers.length > 0 &&
                state.availablePlayers.length < 4)) && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-amber-200">
                  {dict.thinPoolWarning.replace(
                    "{count}",
                    String(state.availablePlayers.length),
                  )}
                </div>
              )}
          <div className="flex items-center gap-4">
            <span className="micro-label text-muted shrink-0">
              {dict.round} {state.round}/{config.rosterSize}
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          {isBroadcastSport ? (
            <PlayerPoolList
              sport={sport}
              players={state.availablePlayers}
              usedEras={state.usedEras}
              openSlotLabels={openLabels}
              mode={state.mode}
              dict={dict}
              club={state.currentSpin?.club}
              era={state.currentSpin?.era}
              onPick={handlePick}
            />
          ) : (
            <>
              {state.currentSpin && (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-sport/10 bg-sport/5 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                    {state.currentSpin.club} · {state.currentSpin.era}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-sport/40" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-sport">
                    {pickablePlayers.length} {dict.available}
                  </span>
                </div>
              )}
              <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                {pickablePlayers.length === 0 ? (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
                    <p className="text-sm font-bold uppercase tracking-widest text-amber-200">
                      {dict.noPlayersFit}
                    </p>
                  </div>
                ) : (
                  pickablePlayers.map((p) => (
                    <PlayerCard
                      key={p.id}
                      player={p}
                      blind={state.mode === "blind"}
                      onSelect={() => handlePick(p)}
                    />
                  ))
                )}
              </div>
            </>
          )}
          {isVersusDaily && !isBroadcastSport && (
            <EraTracker sport={sport} eras={eras} usedEras={state.usedEras} />
          )}
          </div>
        </PhasePanel>
      )}

      {state.phase === "placing" && state.pendingPlayer && (
        <PhasePanel key="placing" className="flex flex-col gap-4">
          {isBroadcastSport && (
            <LineupBoard
              variant={sport}
              lineup={state.lineup}
              positions={isFootball ? slotPositions : undefined}
              formationLabel={
                isFootball ? getFormationLabel(formationId) : undefined
              }
              placing
            />
          )}
          <div className="rounded-2xl border border-sport bg-sport/10 p-5 text-center glow-sport">
            <p className="micro-label text-sport">
              {dict.assignPosition}: {state.pendingPlayer.name.toUpperCase()}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {openSlots
              .filter((slot) =>
                canPlaceAtPosition(state.pendingPlayer!.positions, slot.label),
              )
              .map((slot) => (
                <button
                  key={slot.key}
                  type="button"
                  className="group relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-surface/50 py-5 transition-all hover:border-sport hover:bg-sport/5"
                  onClick={() => dispatch({ type: "PLACE", slot: slot.key })}
                >
                  <span className="font-display text-2xl tracking-widest text-text transition-colors group-hover:text-sport">
                    {slot.label}
                  </span>
                  <div className="mt-1 h-0.5 w-4 rounded-full bg-white/10 transition-all group-hover:w-8 group-hover:bg-sport" />
                </button>
              ))}
          </div>
        </PhasePanel>
      )}

      {state.phase === "simulating" && (
        <PhasePanel
          key="simulating"
          className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-white/5 bg-surface/30 py-16"
        >
          {simError ? (
            <div className="px-6 text-center">
              <p className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm font-bold uppercase tracking-widest text-red-300">
                {simError}
              </p>
              <button
                type="button"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 font-display text-xl tracking-widest text-text transition-all hover:bg-white/10"
                onClick={() => dispatch({ type: "RESET" })}
              >
                {dict.playAgain.toUpperCase()}
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-sport/20" />
                <div className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-4 border-sport border-t-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="h-8 w-8 animate-pulse text-sport" />
                </div>
              </div>
              <div className="text-center">
                <p className="animate-pulse font-display text-3xl tracking-[0.3em] text-sport">
                  {dict.simulate.toUpperCase()}
                </p>
                <p className="micro-label mt-2 text-muted">{dict.analyzingPerformance}</p>
              </div>
            </>
          )}
        </PhasePanel>
      )}
    </AnimatePresence>
  );

  const draftContent = (
      <div
        className={`relative mx-auto flex min-w-0 flex-col gap-6 px-4 pb-[max(8rem,env(safe-area-inset-bottom))] pt-4 sm:gap-8 sm:p-6 sm:pb-32 ${
          isBroadcastSport ? "max-w-7xl" : "max-w-2xl"
        }`}
      >
        {(state.mode === "daily" || state.dailySpins) && (
          <div className="rounded-xl border border-sport/30 bg-sport/10 px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-sport">
            {state.mode === "daily"
              ? dict.dailyBanner
              : challengeTargetWins != null
                ? dict.beatChallenge.replace("{wins}", String(challengeTargetWins))
                : dict.challengeLoaded}
          </div>
        )}

        {/* Header Stats */}
        {isBroadcastSport ? (
          <ScoreBug
            round={state.round}
            rosterSize={config.rosterSize}
            mode={state.mode}
            club={state.currentSpin?.club}
            era={state.currentSpin?.era}
            maxWins={isFootball ? 38 : 82}
            labelRound={dict.round}
            labelMode={dict.activeMode}
          />
        ) : (
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="micro-label text-muted">{dict.draftProgress}</span>
            <span className="font-display text-6xl leading-none text-text">
              {state.picks.length}<span className="text-sport">/</span>{config.rosterSize}
            </span>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="micro-label text-muted">{dict.activeMode}</span>
            <span className="font-display text-2xl tracking-widest text-sport uppercase">{state.mode}</span>
          </div>
        </div>
        )}

        {/* Progress Bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full bg-sport transition-all duration-700 shadow-[0_0_10px_var(--sport-glow)]"
            style={{
              width: `${(state.picks.length / config.rosterSize) * 100}%`,
            }}
          />
        </div>

        {/* Main Game Area */}
        <div
          className={`grid gap-8 ${
            broadcastPicking || (isBroadcastSport && isSpinningPhase)
              ? "grid-cols-1"
              : isBroadcastSport
                ? "lg:grid-cols-[1fr_400px]"
                : "lg:grid-cols-[1fr_380px]"
          }`}
        >
          {isBroadcastSport ? (
            <>
              <div className="flex min-w-0 flex-col gap-8">{playerPanel}</div>
              {!broadcastPicking && <div>{sidebar}</div>}
            </>
          ) : (
            <>
              <div>{sidebar}</div>
              <div className="flex flex-col gap-8">{playerPanel}</div>
            </>
          )}
        </div>

        {state.phase === "spinning" && !spinAnimating && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-bg via-bg/90 to-transparent p-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden">
            <button
              type="button"
              className="w-full rounded-2xl bg-sport py-5 font-display text-2xl tracking-[0.15em] text-bg shadow-[0_-10px_40px_var(--sport-glow)] transition-transform active:scale-95 sm:py-6 sm:text-3xl sm:tracking-[0.2em]"
              onClick={() => runSpin(openLabels)}
            >
              {dict.spin.toUpperCase()}
            </button>
          </div>
        )}
      </div>
  );

  return (
    <SportThemeProvider sport={sport}>
      {isBroadcastSport ? (
        <>
          {isBasketball ? (
            <BasketballEdgeHeroes phase="draft" />
          ) : (
            <FootballEdgeHeroes phase="draft" />
          )}
          <SportBackdrop sport={sport} className="min-h-screen">{draftContent}</SportBackdrop>
        </>
      ) : (
        draftContent
      )}
    </SportThemeProvider>
  );
}
