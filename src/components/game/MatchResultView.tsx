"use client";

import type { BasketballMatchResult } from "@/lib/simulation/match/basketball-match";
import type { FootballMatchResult } from "@/lib/simulation/match/football-match";
import type { Dictionary } from "@/lib/i18n/dictionaries";

function pct(made: number, att: number): string {
  if (att <= 0) return "—";
  return `${Math.round((made / att) * 100)}%`;
}

export function BasketballMatchResultView({
  result,
  dict,
}: {
  result: BasketballMatchResult;
  dict: Dictionary;
}) {
  const m = dict.sandbox.match;
  const winnerLabel =
    result.winner === "home"
      ? result.home.label
      : result.winner === "away"
        ? result.away.label
        : m.tie;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-sport/30 bg-sport/10 p-6 text-center">
        <p className="micro-label text-muted">{m.finalScore}</p>
        <p className="mt-2 font-display text-5xl tracking-tight text-text sm:text-6xl">
          <span className="text-sport">{result.home.score}</span>
          <span className="mx-3 text-muted">–</span>
          <span className="text-sport">{result.away.score}</span>
        </p>
        <p className="mt-2 text-xs font-black uppercase tracking-widest text-muted">
          {result.home.label} · {result.away.label}
        </p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-sport">
          {m.winner}: {winnerLabel}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted">
          {result.quarters.map((q, i) => (
            <span
              key={i}
              className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 tabular-nums"
            >
              {i < 4 ? `Q${i + 1}` : "OT"} {q.home}–{q.away}
            </span>
          ))}
        </div>
      </div>

      {[result.home, result.away].map((team) => (
        <div key={team.label} className="overflow-x-auto rounded-2xl border border-white/10 bg-black/30">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="font-display text-xl tracking-widest text-sport">
              {team.label.toUpperCase()}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
              {team.score} PTS · {team.totals.reb} REB · {team.totals.ast} AST ·{" "}
              {pct(team.totals.fgMade, team.totals.fgAtt)} FG
            </p>
          </div>
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-muted">
                <th className="px-3 py-2 font-bold">{m.player}</th>
                <th className="px-2 py-2 font-bold">MIN</th>
                <th className="px-2 py-2 font-bold">PTS</th>
                <th className="px-2 py-2 font-bold">REB</th>
                <th className="px-2 py-2 font-bold">AST</th>
                <th className="px-2 py-2 font-bold">STL</th>
                <th className="px-2 py-2 font-bold">BLK</th>
                <th className="px-2 py-2 font-bold">TO</th>
                <th className="px-2 py-2 font-bold">FG</th>
                <th className="px-2 py-2 font-bold">3PT</th>
                <th className="px-2 py-2 font-bold">FT</th>
                <th className="px-2 py-2 font-bold">+/-</th>
              </tr>
            </thead>
            <tbody>
              {team.players.map((p) => (
                <tr key={p.playerId} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-3 py-2">
                    <span className="font-bold text-text">{p.name}</span>
                    <span className="ml-2 text-muted">{p.position}</span>
                  </td>
                  <td className="px-2 py-2 tabular-nums">{p.minutes}</td>
                  <td className="px-2 py-2 tabular-nums font-bold text-sport">{p.pts}</td>
                  <td className="px-2 py-2 tabular-nums">{p.reb}</td>
                  <td className="px-2 py-2 tabular-nums">{p.ast}</td>
                  <td className="px-2 py-2 tabular-nums">{p.stl}</td>
                  <td className="px-2 py-2 tabular-nums">{p.blk}</td>
                  <td className="px-2 py-2 tabular-nums">{p.tov}</td>
                  <td className="px-2 py-2 tabular-nums">
                    {p.fgMade}/{p.fgAtt}
                  </td>
                  <td className="px-2 py-2 tabular-nums">
                    {p.threeMade}/{p.threeAtt}
                  </td>
                  <td className="px-2 py-2 tabular-nums">
                    {p.ftMade}/{p.ftAtt}
                  </td>
                  <td className="px-2 py-2 tabular-nums">{p.plusMinus > 0 ? `+${p.plusMinus}` : p.plusMinus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export function FootballMatchResultView({
  result,
  dict,
}: {
  result: FootballMatchResult;
  dict: Dictionary;
}) {
  const m = dict.sandbox.match;
  const winnerLabel =
    result.winner === "home"
      ? result.home.label
      : result.winner === "away"
        ? result.away.label
        : m.draw;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-sport/30 bg-sport/10 p-6 text-center">
        <p className="micro-label text-muted">{m.finalScore}</p>
        <p className="mt-2 font-display text-5xl tracking-tight text-text sm:text-6xl">
          <span className="text-sport">{result.home.score}</span>
          <span className="mx-3 text-muted">–</span>
          <span className="text-sport">{result.away.score}</span>
        </p>
        <p className="mt-2 text-xs font-black uppercase tracking-widest text-muted">
          {result.home.label} · {result.away.label}
        </p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-sport">
          {m.winner}: {winnerLabel}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-[10px] font-bold uppercase tracking-widest text-muted sm:grid-cols-4">
          <span className="rounded-lg border border-white/10 bg-black/30 px-2 py-2">
            xG {result.home.xg}–{result.away.xg}
          </span>
          <span className="rounded-lg border border-white/10 bg-black/30 px-2 py-2">
            {m.possession} {result.home.possession}%–{result.away.possession}%
          </span>
          <span className="rounded-lg border border-white/10 bg-black/30 px-2 py-2">
            {m.shots} {result.home.shots}–{result.away.shots}
          </span>
          <span className="rounded-lg border border-white/10 bg-black/30 px-2 py-2">
            SOT {result.home.shotsOnTarget}–{result.away.shotsOnTarget}
          </span>
        </div>
      </div>

      {result.events.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-muted">
            {m.events}
          </p>
          <ul className="flex flex-col gap-2">
            {result.events.map((e, i) => (
              <li
                key={`${e.minute}-${e.playerId}-${i}`}
                className="flex items-center gap-3 text-sm"
              >
                <span className="w-10 tabular-nums text-muted">{e.minute}&apos;</span>
                <span className="text-sport">⚽</span>
                <span className="font-bold text-text">{e.playerName}</span>
                {e.assistName && (
                  <span className="text-xs text-muted">({e.assistName})</span>
                )}
                <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-muted">
                  {e.team === "home" ? result.home.label : result.away.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {[result.home, result.away].map((team) => (
        <div key={team.label} className="overflow-x-auto rounded-2xl border border-white/10 bg-black/30">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="font-display text-xl tracking-widest text-sport">
              {team.label.toUpperCase()}
            </p>
          </div>
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-muted">
                <th className="px-3 py-2 font-bold">{m.player}</th>
                <th className="px-2 py-2 font-bold">MIN</th>
                <th className="px-2 py-2 font-bold">G</th>
                <th className="px-2 py-2 font-bold">A</th>
                <th className="px-2 py-2 font-bold">S</th>
                <th className="px-2 py-2 font-bold">SOT</th>
                <th className="px-2 py-2 font-bold">KP</th>
                <th className="px-2 py-2 font-bold">TKL</th>
                <th className="px-2 py-2 font-bold">INT</th>
                <th className="px-2 py-2 font-bold">CLR</th>
                <th className="px-2 py-2 font-bold">SV</th>
                <th className="px-2 py-2 font-bold">RTG</th>
              </tr>
            </thead>
            <tbody>
              {team.players.map((p) => (
                <tr key={p.playerId} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-3 py-2">
                    <span className="font-bold text-text">{p.name}</span>
                    <span className="ml-2 text-muted">{p.position}</span>
                  </td>
                  <td className="px-2 py-2 tabular-nums">{p.minutes}</td>
                  <td className="px-2 py-2 tabular-nums font-bold text-sport">{p.goals}</td>
                  <td className="px-2 py-2 tabular-nums">{p.assists}</td>
                  <td className="px-2 py-2 tabular-nums">{p.shots}</td>
                  <td className="px-2 py-2 tabular-nums">{p.shotsOnTarget}</td>
                  <td className="px-2 py-2 tabular-nums">{p.keyPasses}</td>
                  <td className="px-2 py-2 tabular-nums">{p.tackles}</td>
                  <td className="px-2 py-2 tabular-nums">{p.interceptions}</td>
                  <td className="px-2 py-2 tabular-nums">{p.clearances}</td>
                  <td className="px-2 py-2 tabular-nums">{p.saves}</td>
                  <td className="px-2 py-2 tabular-nums font-bold">{p.rating.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
