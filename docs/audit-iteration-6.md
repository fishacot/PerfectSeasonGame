# Аудит итерация 6 — Result screen + Formation picker + How to Play

**Дата:** 2026-07-07  
**Сборка:** `npm run build` — **PASS**

---

## % готовности

| Вид | Было (ит.5) | Стало | Δ |
|-----|-------------|-------|---|
| **NBA (82-0)** | 98% | **99%** | +1 |
| **Футбол (38-0)** | 96% | **98%** | +2 |
| **Хоккей** | 97% | **98%** | +1 |

**Сводный %:** ~97% → **~98%**

---

## Реализовано

### 1. Result screen (82-0 parity)

| Критерий | Статус |
|----------|--------|
| Letter grade A+…F | **PASS** — `scoreToGrade()` в `grade.ts` |
| Best pick | **PASS** — era-adjusted highest rating |
| Weakest category | **PASS** — уже было, усилено в UI |
| Tier labels (Invincibles/GOAT/…) | **PASS** — `winsToTier()` + i18n |
| i18n en/ru | **PASS** |

### 2. Formation picker (38-0.app v2 start)

| Критерий | Статус |
|----------|--------|
| 4-3-3 default | **PASS** |
| 4-4-2, 3-5-2 | **PASS** — `formations.ts` |
| Picker on mode-select | **PASS** — football only |
| Badge on pitch | **PASS** — dynamic label |
| LM/RM position fit | **PASS** — validation groups |

### 3. How to Play

| Критерий | Статус |
|----------|--------|
| `/[locale]/how-to-play` | **PASS** |
| Link from hub + header + mode-select | **PASS** |
| i18n en/ru | **PASS** |

---

## Файлы

- `src/lib/simulation/grade.ts` — grade, tier, bestPick, enrichBreakdown
- `src/lib/config/formations.ts` — 433/442/352
- `src/components/game/ResultBreakdown.tsx` — grade hero, best/weakest cards
- `src/app/[locale]/how-to-play/page.tsx`
- Adapters basketball/football/hockey — use enrichBreakdown
- `GameClient.tsx` — formation picker
- `dictionaries.ts` — result + how-to-play strings

---

## Остаётся (ит.7+)

- Playstyle pre-draft (82-0)
- Difficulty/rerolls football (38-0.app)
- Daily leaderboard API
- NBA era-repeat product decision
- Game-by-game season reveal animation
- 10+ formations (38-0 full scale)

---

## Regression

```bash
npm run build                          # PASS
npx tsx src/lib/simulation/grade.ts    # PASS
npx tsx src/lib/game/challenge.ts      # PASS
npx tsx src/lib/simulation/engine.ts   # PASS
```
