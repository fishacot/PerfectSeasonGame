# Глубокий аудит референсов: 82-0 (NBA) и 38-0 (футбол)

**Дата:** 7 июля 2026  
**Референсы:** [82-0.com](https://www.82-0.com/) → [82-0-challenge.com](https://www.82-0-challenge.com/), [38-0.app](https://38-0.app/), [38-0.org](https://www.38-0.org/)  
**Кодовая база:** Perfect Season Hub (Next.js 16)  
**Метод:** web fetch/search + статический анализ `scripts/generate-data.ts`, `src/lib/game/spin.ts`, `src/components/game/GameClient.tsx`, seeds, simulation adapters

### Verified / pending (iteration 7)

| Area | Status | Check |
|------|--------|-------|
| NBA BBR sample (43 legends) | **verified** | `npm run validate:nba` |
| NBA full 2061 rows | pending expansion | grow `scripts/bbr-reference/` |
| Football FBref sample (10) | **verified** | `npm run validate:football` |
| NBA era-repeat | **fixed** | `maxPerEra: 5` |
| NBA chemistry | **removed** | basketball sim `chem = 1` |
| NBA pre-draft UX | **done** | playstyle / stats / reveal |
| Football 3-4-3, 5-3-2 | **done** | `formations.ts` |
| Football difficulty rerolls | **done** | easy 3 / normal 1 / hard 0 |

---

## Краткое резюме

| Продукт | Суть | Parity кодовой базы |
|---------|------|---------------------|
| **82-0** | 5 раундов NBA-драфта → симуляция 82 игр | **~96%** механики ядра |
| **38-0.app** | 11 раундов EPL all-time XI → 38 игр | **~70%** (данные и pre-draft UX сильно урезаны) |
| **38-0.org** | 11 раундов UCL/Premier-style XI (клуб + **десятилетие**) | **~85%** ближе к нашей модели эр |

Два домена 38-0 — **разные продукты одной механики**: `.app` = сезонная гранулярность EPL 1992–2026; `.org` = клуб + decade (как у нас).

---

## Часть 1. 82-0 (NBA)

### 1.1 Идентичность продукта

- **Бренд:** 82-0 Challenge / 82-0 Basketball Builder
- **Домены:** `82-0.com` редиректит на `82-0-challenge.com`
- **Цель:** собрать 5 игроков из случайных **франшиза + десятилетие**, разместить на корте, получить проекцию рекорда **0–82** (идеал — 82-0)
- **Юридическое:** неофициальный fan-made продукт, не аффилирован с NBA

### 1.2 Игровой цикл (game loop)

```
mode-select → [pre-draft settings] → round 1..5:
  SPIN (slot machine: team + decade)
  → PICK (1 игрок из пула клуба×эры)
  → PLACE (PG/SG/SF/PF/C — слот, который игрок реально играл)
  → [следующий раунд или симуляция]
→ SIMULATE → RESULT → SHARE / PLAY AGAIN
```

**Детали раунда:**
- Ровно **5 раундов**, **1 пик за раунд**
- Десятилетия **могут повторяться** в classic — **да** (iteration 7: `maxPerEra: 5`)
- Игрок после выбора **исчезает из пула** на оставшиеся раунды
- Двухшаговый pick: сначала карточка игрока, затем выбор открытого слота

### 1.3 Спин (slot machine)

| Параметр | 82-0 | Наш код |
|----------|------|---------|
| Что крутится | Franchise + Decade | `club` + `era` — `spinTeamEraWithPool()` |
| Анимация | Slot machine UI | `SlotMachine` + 1200ms delay |
| Пул после спина | Только игроки этой команды в этом десятилетии | `getPlayersForSpin()` фильтр `club` + `era` |
| Минимальный пул | «Real roster» — десятки игроков на франшизу | `MIN_POOL = 6`, до 64 reroll попыток |
| Сортировка пула | По силе/статам | `rating` desc |

**Edge case 82-0:** тонкий пул (expansion team в ранней эре) — советуют skip early.  
**Edge case у нас:** `spinTeamEraWithPool` перебрасывает, но после 64 попыток может вернуть пустой/тонкий пул → UI: «No players fit open positions — skip team or era».

### 1.4 Размер пула игроков

| Метрика | 82-0 (публично) | Наш код (после ит.4) |
|---------|-----------------|----------------------|
| NBA команд | 30 (все франшизы) | **30** (`NBA_POOL` + `NBA_EXTRA_POOL`) |
| Эры | 1960s–2020s (7) | **7** (`BASKETBALL_ERAS`) |
| Игроков всего | «Real legends, real historical stats» — сотни на команду в агрегате | **942** записей `PlayerSeason` |
| На club×era | Полные исторические составы (десятки сезонов → курируемый top pool) | **min 6** (boost + roster-depth), avg ~6.00 |
| Источник | Basketball Reference (имплицитно) | Курируемые seeds: `nba.ts`, `nba-extra.ts`, `nba-core-boost.ts`, `nba-roster-depth.ts` |

### 1.5 Формат статистики

**82-0 Classic:**
- **PPG · RPG · APG · SPG · BPG** — реальные средние за сезон/эру
- Плюс **era-adjustment** в симуляции (30 pts в 1960s ≠ 30 pts в 2020s)

**82-0 HoopIQ (Blind):**
- Статы **скрыты**, видно имя + позиции + клуб/эра (по памяти)

**Наш `PlayerCard` (basketball):**
- Classic: сетка 5 статов + `rating` badge
- Blind: «Stats Hidden (Blind Mode)», силуэт без OVR
- Симуляция: `adjustStat()` × `eraMultiplier` → категории PTS/REB/AST/STL/BLK

**Gap:** 82-0 показывает **letter grade**, **best pick**, **biggest weakness** на экране результата — у нас только `gateMessage` + category bars.

### 1.6 Правила эр (era rules)

| Правило | 82-0 | Наш код (iter. 7) |
|---------|------|-------------------|
| Повтор эры в classic | **Допускается** | **Допускается:** `maxPerEra: 5` |
| 5 игроков в финале | 5 picks | `eras.length === 5` |
| Chemistry / synergy | Нет штрафов | `chem = 1` для basketball |
| Era-adjust | Да, non-linear + gates | `era-adjust.ts` + exponent 2.4 |

### 1.7 Позиции

- **82-0:** PG, SG, SF, PF, C — каждый слот **один раз**
- Игрок только на позиции, которую **реально играл**
- **Наш код:** `canPlaceAtPosition()` с группами (`G`→SG, `F`→SF/PF)

### 1.8 Скипы (skips)

| Тип | Лимит | Когда |
|-----|-------|-------|
| Skip Team | **1 за игру** | Перекрутить клуб, эра фиксирована |
| Skip Era | **1 за игру** | Перекрутить эру, клуб фиксирован |
| Daily | **0** — locked path | `skipsUsed: { team: true, era: true }` при START daily |

**Стратегия 82-0:** тратить скипы **рано**, не копить до раунда 5.

**Наш код:** `SKIP_TEAM` / `SKIP_ERA` в `draft-state.ts`, `spinClubWithPool` / `spinEraWithPool`.

### 1.9 Blind mode (HoopIQ)

- Отдельный режим на экране выбора + toggle «Show Stats Off» на pre-draft
- **Наш код:** `mode: "blind"` → `PlayerCard blind={true}`, label **HoopIQ** в i18n ✅

### 1.10 Daily Challenge

| Аспект | 82-0 | Наш код |
|--------|------|---------|
| Seed | Один path на весь мир на календарный день | `getDailySpins()` — hash `date:sport:league` |
| Раунды | 5 locked spins | ✅ |
| Скипы | Запрещены | ✅ (chips скрыты) |
| Одна попытка | Заявлено | ❌ нет localStorage gate |
| Leaderboard / best of day | Есть на daily-странице | ❌ |
| Баннер в UI | На daily landing | ❌ ключ `dailyBanner` есть, UI не показывает |

### 1.11 Симуляция

**82-0 engine (публичное описание):**
1. Агрегация **era-adjusted** PTS/REB/AST/STL/BLK
2. **Non-linear win curve** — последние победы дороже
3. **Category gates** — слабая категория режет ceiling
4. Итог: W-L, grade, strengths/weaknesses
5. 82-0 **редок по дизайну** (даже 95-score roster не гарантия)

**Наш `simulateBasketball()`:**
- `nonlinearWinCurve(score, 82)` exponent **2.4**
- `applyCategoryGates()` per PTS/REB/AST/STL/BLK
- `chemistryBonus()` — бонус за повтор клуба/эры (cap 1.12)
- Draws = 0 (как NBA regular season projection)

**Gap:**
- Нет **playstyle** влияния (Balanced / Small Ball / Twin Towers / Run & Gun)
- Нет **Season Reveal** (game-by-game vs instant)
- Нет letter grade (A/B/C…)

### 1.12 Chemistry

**82-0:** не акцентирует chemistry в FAQ (фокус на balance + gates).  
**38-0.org:** chemistry явно важна.  
**Наш код:** `chemistryBonus()` — +3% за каждый повтор клуба, +1.5% за повтор эры.

### 1.13 Share / социальное

| Функция | 82-0 | Наш код |
|---------|------|---------|
| Copy record | ✅ | ShareCard PNG download |
| Share on X | ✅ CTA | ❌ нет прямой интеграции |
| Challenge friend | Текстовый challenge | `?challenge=` base64 — **копирование есть, импорт ❌** |
| PNG card | Вероятно | `html-to-image` off-screen ShareCard |

### 1.14 UI/UX

**82-0 pre-draft screen:**
- Playstyle picker (4 варианта)
- Show Stats On/Off
- Season Reveal: Watch (live) / Instant
- Start Draft CTA

**82-0 in-draft:**
- Slot machine prominent
- Progress 1/5 … 5/5
- Player list с полными stat lines
- Court/lineup visualization
- Skip chips

**82-0 result:**
- Record W-L
- Letter grade
- Best pick highlight
- Weakest category callout

**Наш GameClient:**
- mode-select: Classic / HoopIQ / Daily (без playstyle, без season reveal)
- Draft progress bar + LineupBoard + EraTracker
- ResultBreakdown: record + category bars + chemistry badge
- ~60% hardcoded EN в игровом потоке

### 1.15 Дополнительные режимы 82-0 (вне scope v1)

На сайте перечислены: Salary Cap, No MVPs, One Franchise, One Decade, Era Mode, LeBron Mode, Hard Mode, Team Builder, 20-0 NFL. **У нас — только classic/blind/daily.**

### 1.16 Источники данных

- Basketball Reference (статы, позиции, команды по сезонам)
- Курируемые «legend pools» per franchise×decade
- Era-adjust по темпу/эффективности лиги

---

## Часть 2. 38-0 (футбол)

### 2.1 Два продукта одного бренда

| | **38-0.app** | **38-0.org** |
|--|--------------|--------------|
| Scope | English top-flight only | Champions League clubs + PL-style |
| Клубы | **49** EPL clubs | Barcelona, Liverpool, etc. |
| Player-seasons | **4,000+** | Меньше, decade cards |
| Гранулярность спина | **Клуб + сезон** (1992/93 … 2025/26) | **Клуб + decade** |
| Формации | **10+** (4-3-3, 4-4-2, 3-5-2…) | Fixed **4-3-3** |
| Pre-draft | Rich settings screen | Minimal |

**Наш футбол ближе к 38-0.org** по эрам, но с **5 европейскими лигами** вместо одного EPL.

### 2.2 Игровой цикл

```
pre-draft settings → round 1..11:
  SPIN (club + season/decade)
  → PICK (1 игрок из squad)
  → PLACE (слот в формации)
→ SIMULATE 38 games → RESULT (record + area ratings + identity) → SHARE
```

### 2.3 Pre-draft settings (38-0.app) — критический UX-gap

| Настройка | Опции | Наш код |
|-----------|-------|---------|
| **Formation** | 4-3-3, 4-4-2, 4-2-3-1, 4-5-1, 3-4-3, 3-5-2, 5-4-1, 4-1-2-1-2, 4-4-1-1, 5-3-2, 3-4-1-2, 4-2-2-2 | **Fixed 4-3-3** + badge label |
| **Difficulty** | Easy (3 rerolls), Normal (1), Hard (0 + hidden ratings) | ❌ |
| **Show Ratings** | On/Off (blind) | ✅ blind mode |
| **Draft Mode** | Squad First / Position First | ❌ только Squad First |
| **Player Ratings** | Season vs **Prime** | ❌ только один rating |
| **Era filter** | All-time / 2000s+ / 2010s+ / Modern (2016+) + slider 1992/93–2025/26 | ❌ фиксированные эры лиги |
| **Advanced** | Managers (Gaffers), January Transfer Window | ❌ |

### 2.4 Спин

**38-0.app:**
- Wheel → реальный клуб + **конкретный сезон** (e.g. Arsenal 2003/04)
- Rerolls зависят от difficulty
- Era filter сужает pool сезонов

**38-0.org:**
- Club + **decade** (Barcelona · 2010s)
- 11 раундов

**Наш код:**
- `club` + `era` (1990s–2020s; La Liga+ имеют 1980s)
- `spinTeamEraWithPool`, MIN_POOL=6
- Нет reroll как отдельной механики (только skip team/era в classic — **у футбола скипы не отключены явно**, но 11 раундов без skip chips в daily)

### 2.5 Размер пула

| Метрика | 38-0.app | Наш код |
|---------|----------|---------|
| Клубов EPL | 49 | **21** (EPL config) |
| Player-seasons | 4,000+ | **~1585** football total |
| На club×era | Full squad season | **6** curated |
| Лиги | 1 (EPL) | **5** (EPL, La Liga, Serie A, Bundesliga, Ligue 1) |
| Сезонная точность | 1992/93 per season | Decade buckets |

### 2.6 Формат статов / рейтингов

**38-0 (Yahoo / UI):**
- **FIFA-style:** PAC, SHO, PAS, DRI, DEF, PHY + **Overall**
- Season rating = как в тот сезон; Prime = career peak

**Наш football seed:**
```ts
stats: { goals, assists }  // GK: cleanSheets
rating: 0–99 OVR
```
- UI: OVR bar + G/A badges
- Симуляция: line ratings GK/DEF/MID/ATT, не PAC/SHO

**Gap:** кардинально другой data model — для parity нужен либо импорт FIFA-like атрибутов, либо осознанное упрощение с документированным отклонением.

### 2.7 Правила эр (football)

**38-0.org:** chemistry за same club/era, Ballon d'Or gold names.  
**Наш `ERA_RULES.football`:**
- `minPerEra: 1`, `maxPerEra: 4`, `requiredEras: 4`
- 11 игроков, минимум по 1 из каждой эры 1990s–2020s (для EPL)

### 2.8 Позиции и формация

**38-0 fixed 4-3-3 slots:** GK, RB, CB×2, LB, CM×3, RW, ST, LW  
**Наш `SPORTS.football.positions`:** идентичный набор ✅  
**Gap:** нет picker других формаций → разные позиционные требования.

### 2.9 Blind mode

- 38-0 Hard = no rerolls + hidden ratings
- Наш `blind` скрывает OVR и G/A ✅

### 2.10 Daily

- 38-0.app: «Today's puzzle: one go, fresh every day»
- Один seed, сравнение с друзьями
- **Наш:** API `/api/daily` ✅, one-attempt gate ❌

### 2.11 Симуляция и результат

**38-0 output:**
- Record W-D-L (38 games)
- Area ratings: Attack, Midfield, Defence, Goalkeeping, **Chemistry**
- **Team identity** label (playstyle narrative)
- **Notable results** (ключевые матчи сезона)
- Tiers: Relegation Battle → Champions League → Invincibles → **GOAT** (38-0-0)

**Наш `simulateFootball()`:**
- Wins/losses (draws=0), category gates GK/DEF/MID/ATT
- `chemistryBonus` в breakdown
- Нет team identity, notable matches, tier labels

### 2.12 Chemistry

**38-0.org явно:**
- Same club / same era → bonus
- Natural positions → bonus (у нас через `canPlaceAtPosition`, но chemistry не учитывает «не на своей позиции»)

**Наш код:** только club/era repeat в `chemistryBonus()` — **нет position-fit chemistry**.

### 2.13 Share

- Copy challenge message → друг
- Viral X/social (50M+ impressions заявлено)
- **Наш:** PNG + challenge URL (import broken)

### 2.14 Edge cases

| Case | 38-0 | Наш код |
|------|------|---------|
| GK последним пиком | «Schoolboy error» — слабый GK с бедного клуба | Возможно; нет предупреждения |
| Weak club spin | Искать hidden gem | Тонкий пул → skip или dead end |
| Ballon d'Or decade | Gold highlight | ❌ |
| January window gamble | Random event mid-season | ❌ |
| Draws in record | W-D-L | Только W-L (draws=0) |

---

## Часть 3. Сравнение с кодовой базой

### 3.1 Пайплайн данных (`scripts/generate-data.ts`)

```
Seeds (nba.ts, nba-extra, nba-core-boost, nba-roster-depth, football*, hockey*)
  → mergeClubPools() [dedupe by club|era|name]
  → filterBoostAgainstBase() [boost vs NBA_POOL only]
  → flattenPool() → dedupePlayers() → assertNoDuplicates()
  → validatePool(min=6) → data/{sport}/*.json
```

**Сильные стороны:**
- Убрано клонирование легенд по всем клубам (старый баг LeBron/Rockets)
- `mergeClubPools` + `dedupePlayers` + `assertNoDuplicates`
- `spinTeamEraWithPool` с MIN_POOL=6

**Слабые стороны / известные баги:**

#### Баг: дубликаты игроков (Walt Frazier)

В `data/basketball/nba.json` **два** `Walt Frazier` на `Knicks/1960s` и **два** на `Knicks/1970s`:
- `nba-knicks-1960s-0` (из `nba.ts`) + `nba-knicks-1960s-5` (из `nba-core-boost.ts`)
- Причина: `filterBoostAgainstBase()` фильтрует boost **только против `NBA_POOL`**, но при генерации до полного dedupe или при merge нескольких boost-файлов без пересечения с уже merged pool дубликаты проскальзывают
- `nba.ts` и `nba-core-boost.ts` оба содержат Walt Frazier для Knicks 1960s/1970s
- **Симптом в UI:** две идентичные карточки в списке пика

**Fix path:** расширить `filterBoostAgainstBase` на полный merged base; прогнать `npm run generate:data`; добавить CI assert.

#### Баг: boost merge without full dedupe

- `FOOTBALL_MERGED` = pool + core-boost + epl-extra + leagues-extra **без** `filterBoostAgainstBase`
- `mergeClubPools` dedupe работает **внутри одного вызова**, но football/hockey boost файлы могут дублировать имена если генераторы JSON пересекаются
- NBA: 4 слоя seeds — риск дрейфа при ручном редактировании boost JSON

### 3.2 `src/lib/game/spin.ts`

| Функция | Назначение |
|---------|------------|
| `spinTeamEra` | Случайный club+era с учётом `filterAvailableEras` |
| `spinTeamEraWithPool` | Reroll до MIN_POOL≥6 |
| `spinClubWithPool` / `spinEraWithPool` | Skip team/era |
| `getPlayersForSpin` | Фильтр + sort by rating |
| `getDailySpins` | Детерминированный seed по дате |

**Gap vs 38-0:** нет season-level spin, нет difficulty rerolls.

### 3.3 `src/components/game/GameClient.tsx`

- Reducer-driven phases: mode-select → spinning → picking → placing → simulating → result
- Daily: preloaded spins, skips disabled
- Share: PNG + challenge URL
- **Не реализовано:** `?challenge=` import, daily one-attempt, playstyle, formation picker, i18n game strings

### 3.4 Seeds — объёмы (итерация 4)

| Спорт | Игроков | Клубов/команд | min/pool |
|-------|---------|---------------|----------|
| NBA | 942 | 30 | 6 |
| Football | 1585 | 21 EPL + 10×4 лиг | 6 |
| NHL | 996 | 32 | 6 |

---

## Часть 4. Матрица parity (сводная)

| Критерий | 82-0 | 38-0.app | 38-0.org | Наш код |
|----------|------|----------|----------|---------|
| Раунды драфта | 5 | 11 | 11 | ✅ 5 / 11 / 6 |
| Спин club+time | decade | season | decade | decade ✅ |
| MIN players/spin | many | many | many | 6 ⚠️ |
| Стат формат | PPG/RPG/… | FIFA OVR | OVR + areas | ✅ NBA / ⚠️ FB |
| Blind mode | HoopIQ | Hard+hidden | — | ✅ |
| Skips | 1+1 | rerolls by diff | — | 1+1 NBA; FB partial |
| Daily locked | ✅ | ✅ | — | ✅ partial |
| Chemistry | implicit | ✅ | ✅ | ✅ basic |
| Category gates | ✅ | balance | balance | ✅ |
| Non-linear curve | ✅ | ✅ | ✅ | ✅ |
| Formation picker | N/A | ✅ 10+ | fixed 4-3-3 | fixed 4-3-3 |
| Result grade/identity | ✅ | ✅ tiers | ✅ | ❌ |
| Share challenge | ✅ | ✅ | ✅ | partial |
| Data scale | full NBA | 4000+ | medium | curated |

---

## Часть 5. Top 10 gaps (приоритет для parity)

1. **Сезонная гранулярность футбола** — 38-0.app крутит club×**season** (1992/93…), мы — club×**decade**; 4000+ player-seasons vs ~1585 записей.
2. **FIFA-атрибуты футбола** (PAC/SHO/PAS/DRI/DEF/PHY) vs наш OVR+G/A — другая модель симуляции и UI.
3. **Formation picker** — 10+ формаций на 38-0.app; у нас stub fixed 4-3-3.
4. **Pre-draft UX** — playstyle (82-0), difficulty/rerolls, Prime vs Season, Position-first draft, era slider — отсутствуют.
5. **Экран результата** — letter grade, best pick, team identity, notable matches, tier labels (Invincibles/GOAT).
6. **Daily one-attempt + leaderboard** — API есть, enforcement и UI нет.
7. **Challenge URL import** — copy есть, replay по `?challenge=` не работает.
8. **Дубликаты в данных** (Walt Frazier) — boost merge / stale JSON; ломает доверие к пулу.
9. **NBA era-repeat rule** — мы требуем 5 уникальных эр; 82-0 classic допускает повтор decades.
10. **i18n + How to Play** — ~40% RU coverage; нет страницы правил как на референсах.

---

## Часть 6. Edge cases — чеклист для QA

### NBA
- [ ] Спин на club×era с ровно 6 игроками, все заняты позиционно → `noPlayersFit`
- [ ] Daily: 5-й пик завершает без повторного spin UI
- [ ] Blind: рейтинг и статы не утекают в DOM/PNG
- [ ] Skip era при исчерпанных доступных эрах → fallback на полный era pool
- [ ] Дубликат имени в пуле → две кликабельные карточки (баг Walt Frazier)

### Football
- [ ] 11 раундов с era min-per-decade (4 эры × min 1)
- [ ] GK только в GK слот
- [ ] Blind скрывает OVR
- [ ] League filter в loader отсекает чужие клубы
- [ ] La Liga 1980s thin pools (extended eras)

### Cross-cutting
- [ ] `isRosterEraValid()` не вызывается перед simulate — невалидный состав может пройти
- [ ] ShareCard off-screen CSS variables
- [ ] `getDailySpins` не использует `spinTeamEraWithPool` — daily может дать thin pool

---

## Приложение A. Ключевые файлы кодовой базы

| Файл | Роль |
|------|------|
| `scripts/generate-data.ts` | Сборка JSON, merge, dedupe, validate |
| `scripts/seeds/nba.ts` | Core 15 franchises |
| `scripts/seeds/nba-extra.ts` | +15 expansion teams |
| `scripts/seeds/nba-core-boost.ts` | Pad to 6 players (⚠️ overlaps) |
| `scripts/seeds/nba-roster-depth.ts` | Role players depth |
| `scripts/seeds/football.ts` | Core football pools |
| `src/lib/game/spin.ts` | Spin logic |
| `src/lib/game/draft-state.ts` | Game loop reducer |
| `src/lib/game/validation.ts` | Position + era filters |
| `src/lib/simulation/engine.ts` | Curve, gates, chemistry |
| `src/lib/simulation/adapters/*.ts` | Per-sport simulate |
| `src/components/game/GameClient.tsx` | Main UI orchestrator |

## Приложение B. Ссылки референсов

- https://www.82-0-challenge.com/how-to-play
- https://www.82-0-challenge.com/how-82-0-is-calculated
- https://www.82-0-challenge.com/can-you-go-82-0
- https://38-0.app/game (pre-draft settings)
- https://38-0.app/ (EPL scale, daily, FAQ)
- https://www.38-0.org/how-it-works (decade model, chemistry, gold names)

---

*Документ предназначен для агентов и разработчиков. Обновлять после каждой итерации `docs/audit-iteration-N.md`.*
