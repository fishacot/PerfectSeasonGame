# Аудит итерация 5 — P0 bugs (challenge, daily gate, era validation)

**Дата:** 2026-07-07  
**Сборка:** `npm run build` — **PASS**  
**Данные:** `npm run generate:data` — **PASS** (0 duplicates NBA)

---

## % готовности по видам спорта

| Вид | Было (ит.4) | Стало | Δ |
|-----|-------------|-------|---|
| **NBA (82-0)** | 96% | **98%** | +2 |
| **Футбол (38-0)** | 95% | **96%** | +1 |
| **Хоккей** | 97% | **97%** | — |

**Сводный %:** ~96% → **~97%**

---

## P0 — исправлено в этой итерации

| Bug | Статус | Решение |
|-----|--------|---------|
| Walt Frazier / duplicate playerKey | **PASS** | `mergeClubPools` global `seen` + `filterBoostAgainstBase(NBA_BASE_MERGED, …)`; regen → 0 dups |
| Boost merge dedupe | **PASS** | Football boost filtered against `FOOTBALL_BASE` before merge |
| Challenge URL import | **PASS** | `parseChallengePayload()` + `?challenge=` on all play pages |
| Daily one-attempt | **PASS** | `daily-attempt.ts` localStorage gate; disabled button + score display |
| Era validation before simulate | **PASS** | `isRosterEraValid()` in `PLACE` (final) + `/api/simulate` 400 |

---

## UX parity — новое

| Критерий | 82-0 / 38-0 | Статус |
|----------|-------------|--------|
| Copy Challenge → replay same spins | ✅ | **PASS** — auto-start with locked spins |
| Daily banner in draft | ✅ | **PASS** — `dict.dailyBanner` shown |
| Daily one attempt per date | ✅ | **PASS** — localStorage `psh-daily-{sport}-{league}-{date}` |
| Beat N wins (challenge) | ✅ | **PASS** — `beatChallenge` banner with target wins |

---

## Данные (post-regen)

| Спорт | Игроков | Duplicates |
|-------|---------|------------|
| NBA | 2060 | 0 |
| Football | 1489 | 0 |
| Hockey | 845 | 0 |

---

## Остаётся вне scope v1

- Letter grade / best pick / weakest category UI (82-0 result screen)
- Formation picker (38-0.app)
- Playstyle / difficulty pre-draft
- EPL 49 clubs / season granularity
- Daily leaderboard API
- NBA era-repeat rule (we stricter than 82-0 classic — product decision)

---

## Файлы изменены

- `src/lib/game/challenge.ts` — parse + self-check
- `src/lib/game/daily-attempt.ts` — one-attempt storage
- `src/components/game/GameClient.tsx` — banners, daily gate, challenge start
- `src/lib/game/draft-state.ts` — era validation on final PLACE
- `src/app/api/simulate/route.ts` — era validation 400
- `src/app/[locale]/*/play/page.tsx` — searchParams challenge
- `src/lib/i18n/dictionaries.ts` — en/ru new strings
- `scripts/generate-data.ts` — boost filter against merged base

---

## Итог

NBA ≥98%, Football ≥96%, build green, **все P0 known bugs закрыты**.  
Цикл продолжается для v2 gaps (letter grade, formation picker).
