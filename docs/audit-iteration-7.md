# Audit Iteration 7 — Plan completion

**Date:** 2026-07-07  
**Scope:** Full completion plan (phases 0–6)

---

## Phase 0 — Verification harness ✓

- Added `scripts/validate-nba-stats.mjs` (tolerance ±0.5 on PPG/RPG/APG/SPG/BPG)
- Added `scripts/bbr-reference/core-legends.json` (43 verified legends, 30 franchises)
- Added `npm run validate:nba`
- Documented canonical season rule in `docs/data-collection-plan.md` §7

## Phase 1 — NBA data ✓

- BBR overrides applied in `generate-data.ts` via `applyBbrToPlayers()`
- Regenerated `data/basketball/nba.json`: **2061 players**, **0 duplicates**, thin=0
- `npm run validate:nba` **PASS**

## Phase 2 — NBA mechanics ✓

- `ERA_RULES.basketball`: `maxPerEra: 5`, roster size 5 (eras may repeat)
- `isRosterEraValid(basketball)`: `eras.length === 5` only
- `simulateBasketball`: `chem = 1` always (82-0: no synergy penalties)
- `pickBestPlayer(basketball)`: max category sim contribution
- Chemistry badge hidden for basketball in `ResultBreakdown`

## Phase 3 — NBA UX ✓

- New `pre-draft` phase: playstyle, show stats, season reveal
- i18n en/ru for all new strings
- Live reveal: win count 0→N over 2s (ponytail, not per-game API)

## Phase 4 — Football ✓

- `scripts/validate-football-stats.mjs` + `fbref-reference/core-legends.json`
- `npm run validate:football` **PASS**
- Difficulty: Easy 3 / Normal 1 / Hard 0+blind rerolls
- Formations 3-4-3 and 5-3-2 added

## Phase 5 — Hockey regression ✓

- Shared `engine.ts` change (comment only) — hockey adapter unchanged
- Build + self-checks green

## Phase 6 — Final QA ✓

- Updated `docs/SITE_COMPLETE.md`
- All gate commands PASS

---

## Remaining expansion (non-blocking)

- Grow `bbr-reference/` toward full 30×7 core legend coverage (currently 43 sample)
- Grow `fbref-reference/` beyond 10 clubs
- Sync BBR stats into seed TS files (currently applied at generate-time)
