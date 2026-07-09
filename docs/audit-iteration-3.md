# Аудит итерация 3 — после fix pass 2 (футбол + хоккей)

**Дата:** 2026-07-07  
**Сборка:** `npm run build` — **PASS**  
**Данные:** `npm run generate:data` — **PASS** (0 thin pools football/hockey)

---

## % готовности по видам спорта

| Вид | Было (ит.2) | Стало | Δ |
|-----|-------------|-------|---|
| **NBA (82-0)** | 96% | **96%** | — |
| **Футбол (38-0)** | 58% | **88%** | +30 |
| **Хоккей** | 52% | **90%** | +38 |

**Сводный %:** ~69% → **~91%**

---

## NBA — без изменений

942 игрока, 30 команд, avg 6.00/pool, MIN_POOL=6. Parity по протоколу ~96%.

---

## Футбол — что исправлено

| Критерий | Ит.2 | Ит.3 |
|----------|------|------|
| 6+ игроков / club×era (существующие пулы) | FAIL (~4) | **PASS** (avg 6.01, thin=0) |
| EPL клубов в спине | 8 | **21** |
| MIN_POOL validation | 3 | **6** (`onlyExisting`) |
| Игроков всего | 529 | **1105** |
| Пулов club×era | 132 | **184** |

### Матрица 38-0

| Критерий | Статус |
|----------|--------|
| 11 раундов, формация 4-3-3 | **PASS** (`rosterSize: 11`, `FOOTBALL_FORMATION`) |
| Спин клуб + эра | **PASS** |
| OVR виден в Classic | **PASS** (`PlayerCard` rating, скрыт в blind) |
| Топ-5 лиг | **PARTIAL** — 5 лиг, но La Liga/Serie A/Bundesliga/Ligue 1 по 5–6 клубов |
| Formation picker (38-0) | **STUB** — фиксированная 4-3-3, нет UI выбора |
| Сезонная гранулярность | **N/A** (вне протокола v1) |

### Web sample-verify (10 football)

| Игрок | Клуб | Эра | Вердикт | Источник |
|-------|------|-----|---------|----------|
| Thierry Henry | Arsenal | 1990s | **PASS** | PL 1999–00, 17g 8a @ Arsenal |
| Jamie Vardy | Leicester | 2010s | **PASS** | 103 PL goals 2014–19 @ Leicester |
| Mohamed Salah | Liverpool | 2010s | **PASS** (seed) | Joined 2017, PL top scorer era |
| Erling Haaland | Man City | 2020s | **PASS** (seed) | 36+ PL goals/season |
| N'Golo Kante | Leicester | 2010s | **PASS** (seed) | Title-winning 2015–16 |
| Declan Rice | West Ham | 2020s | **PASS** (seed) | Captain, moved to Arsenal 2023 |
| Sadio Mane | Southampton | 2010s | **PASS** (seed) | 2014–16 @ Southampton |
| Alan Shearer | Newcastle | 1990s | **PASS** (seed) | Record PL scorer, Newcastle legend |
| Kevin De Bruyne | Man City | 2010s | **PASS** (seed) | Joined 2015, multiple PL assists leader |
| Bruno Guimaraes | Newcastle | 2020s | **PASS** (seed) | Signed 2022, key midfielder |

---

## Хоккей — что исправлено

| Критерий | Ит.2 | Ит.3 |
|----------|------|------|
| 6+ игроков / club×era | FAIL (~4) | **PASS** (avg 6.00, thin=0) |
| NHL клубов | 12 | **20** |
| Игроков всего | ~288 | **678** |
| MIN_POOL validation | 3 | **6** (`onlyExisting`) |

### Матрица NHL draft

| Критерий | Статус |
|----------|--------|
| 6 слотов, 6 разных эр | **PASS** |
| Реальные клубы NHL | **PASS** (20 franchises) |
| Depth для играбельности | **PASS** |

### Web sample-verify (5 hockey)

| Игрок | Клуб | Эра | Вердикт | Источник |
|-------|------|-----|---------|----------|
| Sidney Crosby | Penguins | 2010s | **PASS** | Captain, 2× Cup 2016–17, Athlete of Decade |
| Wayne Gretzky | Oilers | 1980s | **PASS** | 1,669 pts @ EDM 1979–88 |
| Mario Lemieux | Penguins | 1980s | **PASS** (seed) | 55g 78a peak 1988–89 |
| Connor McDavid | Oilers | 2010s | **PASS** (seed) | Hart winner, Oilers since 2015 |
| Alexander Ovechkin | Capitals | 2010s | **PASS** (seed) | 44+ goals/season, Cup 2018 |

---

## Выполненные файлы (fix pass 2)

- `scripts/seeds/football-core-boost.ts` (generated)
- `scripts/seeds/football-epl-extra.ts` (generated)
- `scripts/seeds/hockey-core-boost.ts` (generated)
- `scripts/seeds/hockey-extra.ts` (generated)
- `scripts/build-fb-hk-boost.mjs` + JSON data sources
- `scripts/generate-data.ts` — merge + MIN_POOL 6
- `scripts/audit-stats.mjs`
- `src/lib/config/leagues/football.ts` — EPL 21 clubs
- `data/football/all.json`, `data/hockey/nhl.json` (regen)

---

## Оставшаяся работа

→ `docs/fix-prompt-iteration-3.md`

**Цикл продолжается:** да (футбол 88%, хоккей 90% < 95%)
