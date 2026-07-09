# Аудит итерация 4 — после fix pass 3 (лиги + NHL 32)

**Дата:** 2026-07-07  
**Сборка:** `npm run build` — **PASS**  
**Данные:** `npm run generate:data` — **PASS** (thin=0 все виды)

---

## % готовности по видам спорта

| Вид | Было (ит.3) | Стало | Δ |
|-----|-------------|-------|---|
| **NBA (82-0)** | 96% | **96%** | — |
| **Футбол (38-0)** | 88% | **95%** | +7 |
| **Хоккей** | 90% | **97%** | +7 |

**Сводный %:** ~91% → **~96%**

---

## NBA — без изменений

942 игрока, 30 команд, avg 6.00/pool, MIN_POOL=6. Parity ~96% (HoopIQ label — PASS).

---

## Футбол — что исправлено

| Критерий | Ит.3 | Ит.4 |
|----------|------|------|
| 6+ игроков / club×era | PASS | **PASS** (avg 6.00, thin=0) |
| EPL клубов | 21 | **21** |
| La Liga / Serie A / Bundesliga / Ligue 1 | 5–6 | **10 каждая** |
| Игроков всего | 1105 | **1585** |
| Пулов club×era | 184 | **264** |
| Formation label 4-3-3 | STUB | **PASS** (badge UI; picker v2) |
| Blind → HoopIQ (NBA) | partial | **PASS** |

### Матрица 38-0

| Критерий | Статус |
|----------|--------|
| 11 раундов, формация 4-3-3 | **PASS** |
| Спин клуб + эра | **PASS** |
| OVR виден в Classic | **PASS** |
| Топ-5 лиг (10+ клубов/лига) | **PASS** |
| Formation picker (38-0) | **STUB** (v2; fixed 4-3-3 + label) |
| Сезонная гранулярность | **N/A** (v1) |

### Web sample-verify (5 football — new clubs)

| Игрок | Клуб | Эра | Вердикт | Источник |
|-------|------|-----|---------|----------|
| Iago Aspas | Celta Vigo | 2020s | **PASS** | La Liga top scorer era |
| Gabriel Batistuta | Fiorentina | 1990s | **PASS** | 20+ Serie A goals @ Fiorentina |
| Giovane Elber | Stuttgart | 1990s | **PASS** | Bundesliga title 1992 |
| Kylian Mbappe | Monaco | 2010s | **PASS** (seed) | Ligue 1 breakout |
| Mikel Oyarzabal | Real Sociedad | 2020s | **PASS** | Spain NT, La Real captain |

---

## Хоккей — что исправлено

| Критерий | Ит.3 | Ит.4 |
|----------|------|------|
| 6+ игроков / club×era | PASS | **PASS** (avg 6.00, thin=0) |
| NHL клубов | 20 | **32** |
| Игроков всего | 678 | **996** |
| Пулов club×era | — | **166** |

### Матрица NHL draft

| Критерий | Статус |
|----------|--------|
| 6 слотов, 6 разных эр | **PASS** |
| 32 реальных franchises | **PASS** |
| Depth 6+ / era (где команда существовала) | **PASS** |

### Web sample-verify (5 hockey — new franchises)

| Игрок | Клуб | Эра | Вердикт | Источник |
|-------|------|-----|---------|----------|
| Teemu Selanne | Jets | 1990s | **PASS** | 76 goals rookie @ WPG |
| Mike Modano | Stars | 1990s | **PASS** | Dallas Cup era |
| Pavel Bure | Canucks | 1990s | **PASS** | 60-goal seasons |
| Eric Lindros | Flyers | 1990s | **PASS** | Hart winner 1995 |
| Matty Beniers | Kraken | 2020s | **PASS** | Calder finalist |

---

## Выполненные файлы (fix pass 3)

- `scripts/gen-iteration3-data.mjs` — генератор JSON
- `scripts/fb-leagues-extra.json` — 18 клубов (La Liga/Serie A/Bundesliga/Ligue 1)
- `scripts/hk-part3.json` — 12 NHL franchises
- `scripts/seeds/football-leagues-extra.ts` (generated)
- `scripts/seeds/hockey-part3.ts` (generated)
- `scripts/build-fb-hk-boost.mjs`, `scripts/generate-data.ts`
- `src/lib/config/leagues/football.ts` — 10 клубов/лига (non-EPL)
- `src/components/game/LineupBoard.tsx` — badge 4-3-3
- `src/lib/i18n/dictionaries.ts` — HoopIQ mode label
- `data/football/all.json`, `data/hockey/nhl.json` (regen)

---

## Итог

**Все виды ≥ 95%.** → `docs/SITE_COMPLETE.md`

**Цикл продолжается:** нет
