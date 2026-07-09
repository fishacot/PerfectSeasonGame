# 38-0 Football — FINAL Agent Prompt (worker instruction)

> **Отправь этот файл рабочему агенту целиком.**  
> Цель: довести футбол до механики 38-0 (выбор + расчёт побед) при **3 популярных лигах**.  
> Не трогай basketball / hockey. Не коммить без явной просьбы пользователя.

---

## 0. Продуктовое решение (зафиксировано)

| Решение | Значение |
|---------|----------|
| **Лиги в игре** | Только **3**: `epl`, `laliga`, `seriea` |
| **Модель драфта** | Как **38-0.org**: спин **клуб × декада**, 11 слотов, exact club+era |
| **Эры** | Только `2000s`, `2010s`, `2020s` (как org) |
| **БД игроков** | **38-0.org** chunk → `data/football/all.json` |
| **OVR** | Точная формула `computeOverall` из org (модуль 80841) |
| **G/A на карточках** | Derived из area-ratings (`derive380DisplayStats`) — org не даёт сезон G/A |
| **Симуляция W/D/L** | Портировать баланс линий 38-0 (GK/DEF/MID/ATT + gates + chemistry); эталон — org draft + app how-it-works |
| **EPL upgrade (позже)** | 38-0.app season G/A + match-by-match sim — **не блокер** для MVP 3 лиг |
| **Убрано** | `bundesliga`, `ligue1`, эры 1980s/1990s, клубы без данных org |

**Идея (без подтверждения пользователя):** UI Classic показывает **OVR** как primary (как org), G/A — secondary/derived. Не валидировать против FBref (`validate:football` может падать — ожидаемо).

---

## 1. Откуда что брать (карта источников)

### 1.1 Живые сайты

| Что | URL | Зачем |
|-----|-----|--------|
| Org draft UX + клубы×декады | https://www.38-0.org/draft | Эталон спина, пулов, OVR на карточках |
| Org landing | https://www.38-0.org/ | Описание: UCL XI → 38-game PL season |
| App game (EPL) | https://38-0.app/game | Difficulty, formations, season spin (reference) |
| App how-it-works | https://38-0.app/how-it-works | Баланс GK/DEF/MID/ATT, variance |
| App how-to-play | https://38-0.app/how-to-play | 38 матчей, очки 3/1/0, 114 pts |

### 1.2 Кэшированные webpack-чанки (`scripts/.380-chunks/`)

| Файл | Источник | Содержимое |
|------|----------|------------|
| **`03b78z-83yf1m.js`** | 38-0.org | **PRIMARY DB**: `PLAYERS`, `CLUBS`, `DECADES`, `computeOverall`, factory `l(...)` |
| `app-sim-42cw3m_hcnb06.js` | 38-0.app (alias) | goals/assists/runSimulated keywords — EPL sim/UI |
| `app-ui-1x1831masit6n.js` | 38-0.app | UI + expectedPoints / season result |
| `44_5ro55mi-yo.js` / `app__44_5ro55mi-yo.js` | 38-0.app | `PREMIER_LEAGUE_CLUBS`, `ALL_SEASONS`, formations |
| `app-clubs-meta.js` | 38-0.app | clubs + expectedPoints |

**Команды обновления кэша:**
```bash
npm run fetch:380-materials          # скачать свежие chunks (может timeout — fallback на кэш)
npm run fetch:380-players -- --force # org → all.json
npm run export:380-leagues           # per-league JSON
```

**Fallback без сети:**
```bash
node scripts/pipeline/fetch-380-players.mjs --from-file=scripts/.380-chunks/03b78z-83yf1m.js --force
```

### 1.3 Код проекта (куда класть / что править)

| Путь | Роль |
|------|------|
| `scripts/pipeline/38-0-AGENT.md` | **Этот промпт** (source of truth для агента) |
| `.cursor/rules/38-0-parity.mdc` | Cursor rule (globs football) |
| `scripts/pipeline/380-utils.mjs` | extract + `compute380Overall` + `derive380DisplayStats` + `CLUB_TO_GAME` |
| `scripts/pipeline/fetch-380-players.mjs` | org → `data/football/all.json` |
| `scripts/pipeline/fetch-380-materials.mjs` | скачать chunks |
| `scripts/pipeline/export-380-leagues.mjs` | фильтр по 3 лигам |
| `data/football/all.json` | Игровая БД (**223** игрока после 3-league filter) |
| `data/football/football-database.json` | Meta + areaStats |
| `data/football/leagues/{epl,laliga,seriea}.json` | Per-league exports |
| `data/football/leagues/_summary.json` | Сводка покрытия |
| `data/raw/football/DOWNLOAD_COMPLETE.json` | Статус fetch |
| `src/lib/config/leagues/football.ts` | **3 лиги**, списки клубов |
| `src/lib/config/eras.ts` | `FOOTBALL_ERAS = 2000s/2010s/2020s`, `requiredEras: 3` |
| `src/lib/types.ts` | `FootballLeague = "epl" \| "laliga" \| "seriea"` |
| `src/lib/simulation/adapters/football.ts` | Симуляция — **портировать ближе к 38-0** |
| `src/lib/simulation/engine.ts` | `nonlinearWinCurve`, `applyCategoryGates`, `chemistryBonus` |
| `src/lib/data/loaders.ts` | `loadFootballPlayers(league)` фильтр clubs×eras |
| `src/lib/game/draft-state.ts` | Драфт / rerolls |
| `src/components/game/PlayerCard.tsx` | UI статов |

---

## 2. Три лиги — клубы и покрытие (факт из БД)

| Лига | Клубы (только с данными org) | Игроков | Пулов |
|------|------------------------------|---------|-------|
| **epl** | Arsenal, Chelsea, Liverpool, Manchester City, Manchester United, Tottenham | **89** | 16 |
| **laliga** | Barcelona, Real Madrid, Atletico Madrid, Sevilla | **75** | 11 |
| **seriea** | AC Milan, Inter Milan, Juventus, Napoli | **59** | 11 |
| **Итого** | 14 клубов | **223** | 38 |

Эры: `2000s` / `2010s` / `2020s`. Пул club×era: **2–14** игроков (не фиксированные 6).

**Не добавлять** клубы без org-данных (Valencia, Roma, Newcastle, …) — спин будет пустым.

---

## 3. База игроков — формат и извлечение

### 3.1 Org factory (regex уже в `380-utils.mjs`)

```js
l("id","Name","Club","2000s",["ST","LW"],"ST",{attack:95,midfield:82,defense:42,goalkeeping:8,physical:84,technical:94,uclImpact:90,premFit:96})
```

### 3.2 `PlayerSeason` в игре

```ts
{
  id, name, club, era,           // era: "2000s"|"2010s"|"2020s"
  positions: string[],           // map380Positions (+ AM/FW/DF/MF aliases)
  stats: { goals, assists } | { goals:0, assists:0, cleanSheets },
  rating: number                 // = compute380Overall(primary, area)
}
```

### 3.3 OVR — копировать 1:1 из org (`compute380Overall`)

- GK: `0.55*GK + 0.15*DEF + 0.1*TEC + 0.1*UCL + 0.1*PREM`
- CB/LB/RB: `0.4*DEF + 0.2*PHY + 0.15*TEC + 0.15*UCL + 0.1*PREM`
- CM/CAM: `0.4*MID + 0.25*TEC + 0.15*blend + 0.1*UCL + 0.1*PREM`  
  (`blend = CAM? attack : max(defense, 0.6*attack)`)
- else (ST/W): `0.45*ATT + 0.2*TEC + 0.1*PHY + 0.15*UCL + 0.1*MID`

### 3.4 Dedupe

Org имеет дубль Bremer (Juventus 2020s) — `dedupeByNameClubEra` оставляет max rating.

---

## 4. Механика выбора (драфт) — как 38-0.org

### 4.1 Эталон org

1. Выбор формации (минимум **4-3-3**; app имеет больше — можно добавить позже).
2. **11 раундов**: каждый раунд спин **клуб × декада**.
3. Пул = игроки **точного** клуба и декады, подходящие под открытые слоты.
4. Пик одного игрока → слот.
5. После XI → симуляция 38 матчей.

### 4.2 Что сделать в нашем коде

| Компонент | Сейчас | Нужно |
|-----------|--------|-------|
| Спин | клуб × эра | Оставить; пул только из `FOOTBALL_LEAGUES[league].clubs` × `FOOTBALL_ERAS` |
| Skips | team + era counters | Сохранить (как 82-0 / наш UX); org явных skip в chunk не экспортирует |
| Rerolls | football: 1 | Ок для Normal; Easy=3 / Hard=0 — как app difficulty (опционально) |
| Era rules | `requiredEras: 3`, max 4 per era | Уже выставлено в `eras.ts` |
| Roster | 11 игроков | `isRosterEraValid` — все 3 эры представлены (≥1) |
| Порядок пула | ? | Сортировать **по rating desc** (как 82-0 production order) |

**Weighted spin org (reference, module draft):**  
`score = 6*min(count,6) + 0.37*avgOVR + 0.32*maxOVR` (+11 elite ≥88, −20 allBelow84).  
Можно портировать в spin weights — улучшает parity.

---

## 5. Механика расчёта побед — как 38-0

### 5.1 Публичное описание (app how-it-works)

- Сила **и баланс** по линиям: keeper / defence / midfield / attack.
- Слабая линия → дроп очков (gates).
- Есть **variance** (один XI → разный W-D-L) — app; org ближе к детерминизму.
- Цель: **38-0-0**, 114 очков.

### 5.2 Наш текущий `simulateFootball`

```
categories GK/DEF/MID/ATT (line avg rating × weights)
× chemistry (club/era)
× positionChem (misfits)
→ nonlinearWinCurve(score, 38)  // exponent 2.4 from 82-0
→ applyCategoryGates
→ draws ≈ 12% of non-wins
```

### 5.3 Задача агента по sim (приоритет)

1. **Сохранить** структуру категорий GK/DEF/MID/ATT (это и есть 38-0 balance).
2. Извлечь константы из org/app chunks если найдёшь (`extract-380-sim.mjs` по аналогии с `extract-820-sim.mjs`).
3. Пока констант нет — **калибровать** gates/curve так, чтобы сильный сбалансированный XI давал ~30–36 побед, дырявый ATT/DEF — сильно меньше; perfect 38 — редкий.
4. **Не** использовать G/A в симуляции — только `rating` (+ era-adjust если оставляем).
5. Опционально: лёгкий seed-variance (±1–2 wins) как app — пометить `ponytail:`.

### 5.4 Результат экрана

`wins`, `draws`, `losses`, `maxWins=38`, `perfect`, breakdown categories + chemistry + gate message.  
Очки = `wins*3 + draws` (показать в UI как app).

---

## 6. UI / карточки

| Режим | Показывать |
|-------|------------|
| Classic | **OVR** + позиции; G/A derived (или спрятать G/A если мешает parity) |
| Blind / HoopIQ-аналог | без OVR |
| Daily | без skips (как basketball daily) |

Имена в org часто короткие (`"Henry"`, `"Messi"`) — **не** «исправлять» вручную без источника.

---

## 7. Чеклист работ для рабочего агента

### Уже сделано ✅

- [x] 3 лиги в `types.ts` / `football.ts` / `EdgeHeroes`
- [x] `FOOTBALL_ERAS` = 2000s–2020s, `requiredEras: 3`
- [x] `CLUB_TO_GAME` только 14 клубов
- [x] `all.json` = 223 игрока; league exports
- [x] Пайплайн `fetch:380-players`, `export:380-leagues`, `fetch:380-materials`
- [x] OVR + derive G/A в `380-utils.mjs`
- [x] Chunks закэшированы в `scripts/.380-chunks/`

### Сделать сейчас (MVP parity)

1. [x] **Драфт UX**: spin/pool/pick на 3 лигах; min pool=2; сортировка пула по `rating` desc; skip team+era.
2. [x] **Симуляция**: line balance factor + self-check `check:football-sim` (strong ~30W > unbalanced).
3. [x] **UI**: OVR на карточке Classic; очки `W*3+D` на result/share.
4. [x] **Era validation**: roster требует все 3 эры; copy без top-5 / bundesliga.
5. [x] **Smoke**: `npm run test:smoke` / открыть `/en/football` — только 3 лиги.
6. [x] **Не ломать** `validate:82-0-parity` / NBA / NHL.

### Позже (не блокер)

- [ ] `extract-380-sim.mjs` — точные константы из chunk
- [ ] `fetch-380-app-players.mjs` — EPL season G/A
- [ ] App difficulty Easy/Normal/Hard + formations
- [ ] Weighted spin formula org

---

## 8. Правила агента (non-negotiables)

1. **Источник БД** = только 38-0.org chunk через пайплайн. Не выдумывать статы.
2. **Не возвращать** bundesliga/ligue1 без явного запроса.
3. Любой shortcut → комментарий `ponytail:` + ceiling + upgrade path.
4. Перезапись `all.json` → `--force`.
5. `assertNoDuplicates` / dedupe по `club|era|name`.
6. Не трогать basketball/hockey seeds и 82-0 pipeline.
7. После правок sim — один runnable self-check (assert), без фреймворков.
8. SQLID/KISS/ponytail: минимум файлов, без новых зависимостей.
9. Читать Next.js docs в `node_modules/next/dist/docs/` перед API-изменениями.
10. Этот файл (`38-0-AGENT.md`) обновлять, если меняется модель данных.

---

## 9. Быстрый старт для агента

```bash
# 1. Обновить БД из кэша
npm run fetch:380-players -- --from-file=scripts/.380-chunks/03b78z-83yf1m.js --force
npm run export:380-leagues

# 2. Проверить покрытие
type data\football\leagues\_summary.json

# 3. Править механику
#    src/lib/simulation/adapters/football.ts
#    src/lib/game/draft-state.ts
#    src/components/game/*

# 4. Проверка
npm run test:smoke
```

**Эталон NBA parity:** `.cursor/rules/82-0-parity.mdc` + `fetch-820-players.mjs` — копируй паттерны пайплайна, не константы баскетбола.

---

## 10. Дерево решений (если застрял)

```
Нужны игроки?
  → scripts/.380-chunks/03b78z-83yf1m.js → fetch-380-players → all.json

Нужна лига?
  → только epl | laliga | seriea из football.ts
  → loaders фильтруют clubs

Нужен OVR?
  → 380-utils compute380Overall (не выдумывать)

Нужны G/A?
  → derive380DisplayStats (org) ИЛИ позже app chunk

Нужна симуляция?
  → football.ts categories + engine.ts
  → эталон: 38-0.app/how-it-works (баланс линий)

Нужен UX драфта?
  → 38-0.org/draft (клуб×декада, 11 раундов)
```

---

*Generated for worker agent. Model: 3 leagues × org decades × line-balance sim. Last DB rebuild: 223 players.*
