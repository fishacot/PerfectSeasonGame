# Аудит итерация 1 — Perfect Season Hub

**Дата:** 2026-07-07  
**Референсы:** [82-0.com](https://www.82-0.com/) / [82-0-challenge.com](https://www.82-0-challenge.com/), [38-0.app](https://38-0.app/)  
**Сборка:** `npm run build` — PASS

---

## % готовности по видам спорта

| Вид | % | Комментарий |
|-----|---|-------------|
| **NBA (82-0)** | **78%** | Механика ядра есть; данные 4 игрока/пул; MIN_POOL=1 |
| **Футбол (38-0)** | **58%** | 5 лиг, 11 раундов, OVR; мало клубов и игроков vs 38-0 |
| **Хоккей** | **52%** | 6 слотов, 6 эр; 12 клубов, ~4 игрока/пул |

**Сводный %:** ~63%

---

## Данные NBA

| Метрика | Значение |
|---------|----------|
| Команд в пуле | 30 |
| Игроков | 744 |
| Комбинаций club×era (с данными) | 157 |
| Среднее игроков / club×era | **4.74** (min 4, max 6) |
| Пулов < 6 игроков | **99** (все 15 «core» франшиз из `nba.ts`) |

### Rockets 2010s — PASS
Harden, Chris Paul, Dwight Howard, Russell Westbrook (не LeBron).

---

## Выборочная сверка статистики (15 игроков vs BR / StatMuse)

| Игрок | В данных | Референс | Вердикт |
|-------|----------|----------|---------|
| James Harden (Rockets) | 30/6/8 | 29.6/6.0/7.7 career HOU | PASS (peak-era) |
| Stephen Curry (Warriors 2010s) | 27/5/7 | ~27/5/7 peak | PASS |
| Kevin Durant (Warriors 2010s) | 26/7/5 | ~26/7/5 GS years | PASS |
| Giannis (Bucks 2010s) | 27/11/6 | ~27/11/6 MVP seasons | PASS |
| Nikola Jokic (Nuggets 2010s) | 20/10/7 | ~20/10/7 early peak | PASS |
| Joel Embiid (76ers 2010s) | 27/11/3 | ~27/11/3 | PASS |
| Kawhi Leonard (Spurs 2010s) | 21/7/3 | ~21/7/3 SA | PASS |
| Anthony Davis (Lakers 2010s) | 26/10/3 | ~26/10/3 | PASS |
| Jayson Tatum (Celtics 2010s) | 20/7/3 | ~20/7/3 early | PASS |
| Luka Dončić (Mavs 2010s) | 28/9/8 | ~28/9/8 | PASS |
| Victor Wembanyama (Spurs 2020s) | 21/10/3 | ~21/10/3 rookie | PASS |
| Shaquille O'Neal (Lakers 1990s) | 27/11/3 | ~27/11/3 | PASS |
| Kobe Bryant (Lakers 1990s) | 19/5/4 | ~19/5/4 early LAL | PASS |
| Chris Paul (Suns 2020s) | 14/4/8 | ~14/4/8 PHX | PASS |
| LeBron James (Lakers 2010s) | 27/8/8 | ~27/8/8 LAL | PASS |

Статистика — округлённые peak-era значения, не построчная копия BR. Для игрового драфта — приемлемо.

---

## Матрица PASS/FAIL vs 82-0

| Критерий | Статус |
|----------|--------|
| 30 NBA команд | **PASS** |
| 6+ игроков на club×era | **FAIL** (avg 4.74) |
| 5 раундов, PG/SG/SF/PF/C | **PASS** |
| Спин → пул команды+эры | **PASS** |
| filterPickablePlayers (позиции) | **PASS** |
| PPG/RPG/APG/SPG/BPG Classic | **PASS** |
| Blind (HoopIQ) | **PASS** (как «Blind Draft») |
| 1 skip team + 1 skip era | **PASS** |
| 5 разных эр в составе | **PASS** |
| Симуляция PTS/REB/AST/STL/BLK + gates + curve | **PASS** |
| Chemistry club + era | **PASS** |
| MIN_POOL осмысленный (≥4) | **FAIL** (MIN_POOL=1) |

---

## Матрица PASS/FAIL vs 38-0

| Критерий | Статус |
|----------|--------|
| 11 раундов, 4-3-3 | **PASS** |
| Спин клуб + эра | **PASS** |
| OVR в Classic | **PASS** |
| Топ-5 лиг Европы | **PASS** (маршруты) |
| Масштаб данных (49 клубов EPL, 4000+ сезонов) | **FAIL** (8 EPL клубов, 529 игроков) |
| Сезон по сезонам 1992–2026 | **FAIL** (декады, не сезоны) |

---

## Матрица PASS/FAIL — Хоккей

| Критерий | Статус |
|----------|--------|
| 6 игроков, 6 разных эр | **PASS** |
| Реальные клубы NHL | **PASS** (12 команд) |
| 6+ игроков / club×era | **FAIL** (~4 avg) |

---

## Трассировка game flow (NBA)

1. `GameClient` → mode select (Classic / Blind / Daily)
2. `draftReducer` START → spinning → `spinTeamEraWithPool` → picking
3. `filterPickablePlayers` + `PlayerCard` (stats grid)
4. PLACE → lineup → 5 picks → simulating → `/api/simulate`
5. `simulateBasketball` → era-adjust → categories → chemistry → gates → wins

Соответствует 82-0 flow (spin → pick → place → simulate → share).

---

## Критические пробелы (ранжирование)

1. **P0** — NBA core pools: 4 игрока вместо 6 (99 комбинаций)
2. **P0** — `MIN_POOL = 1` допускает тонкие спины
3. **P1** — Футбол: ~30 клубов vs сотни в 38-0; ~4 игрока/пул
4. **P1** — Хоккей: 12 клубов, ~4 игрока/пул
5. **P2** — i18n: часть строк в `GameClient` только EN
6. **P3** — Нет letter grade / playstyle modes как на 82-0-challenge.com (вне протокола)

---

## Следующий шаг

→ `docs/fix-prompt-iteration-1.md` для Subagent 2
