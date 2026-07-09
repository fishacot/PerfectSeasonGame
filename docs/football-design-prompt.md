# Football Design Parity Prompt — Perfect Season Hub

> Промпт для Gemini / Cursor: довести **футбольный** UI до уровня уже сделанного **баскетбольного** broadcast-shell.  
> Копируй блок **PROMPT START → PROMPT END**.

---

## Краткий аудит (зачем этот промпт)

Баскетбол уже получил «второе поколение» дизайна. Футбол остался на старом sidebar-first layout.

| Слой | Basketball (эталон) | Football (сейчас) |
|------|---------------------|-------------------|
| Atmosphere | `SportBackdrop` + parquet texture | Только body stadium image |
| Edge heroes | `EdgeHeroes` (Jordan/LeBron…) | Нет |
| Progress HUD | `ScoreBug` ESPN-style | Сырой `6xl` fraction |
| Draft canvas | `max-w-7xl`, phase-aware layout | `max-w-2xl`, sidebar-first |
| Spin moment | SlotMachine **center stage** | SlotMachine в sidebar |
| Player pool | `PlayerPoolList` search + filters + rows | Stacked `PlayerCard` cards |
| Portraits | Круглые фото в row/card | **Не показываются** (`sport === "basketball"` gate) |
| Board | SVG half-court + parquet | Flat green CSS pitch |
| Slots | Compact circles | Large dashed rectangles |
| Result | Backdrop + heroes, `max-w-2xl` | Plain, `max-w-lg` |
| Funnel | Direct → play | League grid → league info → play (сохранить) |

**Цель:** футбол должен ощущаться как **тот же продукт**, только с pitch-green DNA вместо hardwood-orange — не отдельный «сырой» режим.

---

## PROMPT START

```
# РОЛЬ
Ты — frontend-дизайнер Perfect Season Hub. Задача: довести ФУТБОЛЬНУЮ часть (38-0) до визуального паритета с уже готовым БАСКЕТБОЛЬНЫМ broadcast-shell (82-0), сохранив футбольную идентичность (зелёный pitch, 11 игроков, OVR, formation/difficulty).

# NORTH STAR
Баскетбол = эталон композиции, атмосферы, motion, density.
Футбол = тот же язык UI, но:
- accent #00E676 + secondary #FFEA00 (не копировать orange/purple)
- pitch / stadium / grass texture (не parquet)
- 11-man XI, G/A/CS stats, OVR остаётся (в отличие от basketball, где OVR скрыт)
- funnel league → info → play НЕ убирать

# ГРАНИЦЫ
✅ ДЕЛАЙ: UI/CSS/компоненты отображения, football atmosphere, layout parity, portraits, pitch polish, i18n UI strings.
❌ НЕ ТРОГАЙ: draftReducer, spin, validation, simulation, API, rating formulas, era rules, seed data math.
❌ НЕ ЛОМАЙ basketball: существующие `isBasketball` ветки должны продолжать работать. Обобщай shared-паттерны, не удаляй basketball-only polish.

# ЭТАЛОН — ЧТО УЖЕ ЕСТЬ В BASKETBALL (КОПИРУЙ ПАТТЕРН)

Изучи и зеркаль структуру (не цвета):

1. `src/components/game/SportBackdrop.tsx`
   - arena photo 25–30% + scrim gradient
   - basketball: parquet texture bottom
   - → football: добавь grass/pitch texture layer (аналог parquet)

2. `src/components/basketball/ScoreBug.tsx`
   - ESPN bug: round pill | club/era | mode | optional W-L
   - → football: тот же компонент обобщить ИЛИ `src/components/football/ScoreBug.tsx` с brand 38-0 / maxWins=38

3. `src/components/basketball/EdgeHeroes.tsx`
   - XL+ edge cutouts legends, portrait-cutout, sport glow
   - → `src/components/football/EdgeHeroes.tsx`: Henry, Ronaldo, Messi, Zidane, Maldini, Haaland (из public/players/football/)

4. `src/components/game/GameClient.tsx` basketball branches:
   - SportBackdrop + EdgeHeroes на mode-select / draft / result
   - ScoreBug вместо raw 6xl progress
   - max-w-7xl draft canvas
   - Spinning: SlotMachine CENTER + compact LineupBoard below
   - Picking: PlayerPoolList left/main, board+era inline, sidebar collapses
   - Sticky mobile SPIN bar
   - → включи те же layout choreography для `sport === "football"`

5. `src/components/game/PlayerPoolList.tsx`
   - search, position filters, sticky stat header, broadcast rows
   - → обобщи фильтры: GK / DEF / MID / FWD (или по positions)
   - header stats: G · A · CS (не PPG/RPG…)
   - OVR column OK для football (basketball без OVR)

6. `src/components/game/PlayerCard.tsx`
   - СЕЙЧАС: photo gated `sport === "basketball"` — УБРАТЬ gate
   - Football card + row: реальные фото через `getPlayerPhotoUrl` / player-photos resolver
   - Card variant: circular или FUT-style portrait (как basketball card hero)
   - Row variant: small circle + name + G/A chips + OVR

7. `src/components/game/LineupBoard.tsx` football:
   - СЕЙЧАС: flat #143d1a + dots
   - ЦЕЛЬ: SVG pitch markings (halfway, circle, boxes) + grass texture overlay
   - Slots: компактнее (ближе к basketball circles), surname below или mini portrait
   - aspect-ratio pitch, rounded-2xl, border-white/15, shadow depth как у court

8. `src/components/game/SportCard.tsx` / hub
   - Football уже имеет cutout (Yamal) — сохранить гармонию с basketball LeBron card
   - Единый frame language: cutout %, gradient overlay, brand pill

# ФУТБОЛЬНЫЕ ЭКРАНЫ — ЧТО СДЕЛАТЬ

## A. League select `/[locale]/football`
Уже неплохо (tiles). Доработать:
- Лёгкий SportBackdrop / stadium wash за сеткой
- Hover: как SportCard (photo scale внутри clip, glow-sport)
- Опционально: subtle league accent (не ломать единый green theme)

## B. League info `/[locale]/football/[league]`
Сейчас: Campaign Goal + Protocols cards + PLAY.
Довести до cinematic:
- Hero strip: stadium BG + lower-third brand «38-0 — {League}»
- Optional edge cutout legend of that league (Henry for EPL, etc.)
- PLAY CTA оставить крупным (уже хороший)
- Protocols в broadcast-panel стиле (как ScoreBug surfaces)

## C. Play `/[locale]/football/[league]/play` — ГЛАВНЫЙ ФОКУС
Обернуть GameClient football path в тот же shell что basketball:

```
SportBackdrop (stadium + grass texture)
  EdgeHeroes (football legends, XL+)
  ScoreBug (round/11, club, era, mode)
  Phase layout:
    spinning → SlotMachine center + compact pitch
    picking  → PlayerPoolList + board/era + skips near pool
    placing  → full pitch with placing highlights
  sticky SPIN (mobile)
```

Mode-select: сохранить formation + difficulty (football-only), но визуально вписать в broadcast tiles (не «форма из админки»). Classic = primary filled; Blind/Daily = secondary hierarchy как basketball.

Result: SportBackdrop + EdgeHeroes, max-w-2xl, FinalRoster с фото (row или card с portrait).

## D. Shared polish
- ResultBreakdown: football chemistry banner оставить; визуально как basketball combo panel (broadcast-panel)
- ShareCard: mini portraits strip если resolver готов
- SkipChips: визуально как basketball (под pool при picking)

# ЦВЕТА И ТЕКСТУРЫ (FOOTBALL DNA)

| Token | Value |
|-------|-------|
| Primary | #00E676 |
| Secondary | #FFEA00 |
| Glow | rgba(0,230,118,0.4) |
| Pitch base | #143d1a → richer SVG |
| Grass texture | /textures/grass.webp (NEW, аналог parquet.webp) |
| Stadium BG | /backgrounds/football-stadium.webp (уже в SportBackdrop map) |
| Gold 90+ | #FBBF24 (как basketball) |
| ScoreBug surface | #0a1428/90 (shared) |

Не перекрашивать basketball. Не делать football «оранжевым».

# ФОТО ИГРОКОВ

1. Убрать `sport === "basketball"` gate в PlayerCard — football тоже показывает фото.
2. Resolver: `src/lib/assets/player-photos.ts` (если есть) или создать — slug от `player.name`.
3. Assets: `public/players/football/{slug}.webp` + `_default.webp` + `_blind.webp`.
4. Fallback: initials plate на green gradient, НЕ Lucide User.
5. EdgeHeroes: только существующие/добавленные cutouts с attribution в PHOTO_CREDITS.md.
6. LineupBoard filled slots: mini 24px cutout если фото есть.

# RESPONSIVE (КАК BASKETBALL)

Mobile 390px:
- Single column, sticky SPIN, ScoreBug stacks (уже умеет flex-wrap)
- EdgeHeroes hidden (xl:block)
- Pool full width, search+filters compact

Desktop 1440px:
- max-w-7xl, phase-aware grid
- EdgeHeroes visible
- Pool scroll ~70vh, board sticky where basketball does

# ANTI AI-SLOP / HARMONY RULES

- Не invent новый «футбольный SaaS» стиль — расширяй существующий broadcast language.
- Не копируй basketball orange accents на football screens.
- Не ставь glass/glow на каждый div.
- Formation/difficulty: 2–3 чёткие tiles, не 12 одинаковых кнопок.
- 11 игроков = row density обязательна (карточки-стопка на 11 человек = плохо).

# ПЛАН РАБОТЫ (ПОРЯДОК)

1. SportBackdrop: grass texture для football
2. ScoreBug: обобщить или football twin; подключить в GameClient для football
3. EdgeHeroes football + wrap mode/draft/result
4. GameClient: `isFootballBroadcast = sport === "football"` с тем же layout choreography что basketball
5. PlayerPoolList: football filters + stats; use for football picking
6. PlayerCard: enable portraits for football; row variant for pool
7. LineupBoard: SVG pitch + grass + compact slots + mini portraits
8. League info page: cinematic hero
9. Mode-select formation/difficulty restyle
10. Result + ShareCard photo polish
11. i18n: football mode hints если нужно (как basketball.classicDesc)
12. npm run build — must pass; basketball regression check

# SELF-CHECK

- [ ] Football play visually «same generation» as basketball (backdrop, bug, phase layout)
- [ ] Green/gold DNA, not orange
- [ ] Portraits visible on football cards/rows
- [ ] PlayerPoolList used for 11-man draft
- [ ] Pitch richer than flat CSS dots
- [ ] League funnel preserved
- [ ] Formation + difficulty still work, look broadcast
- [ ] Basketball still works unchanged in feel
- [ ] Mobile sticky SPIN; desktop EdgeHeroes
- [ ] No game logic / API changes
- [ ] build passes

# OUTPUT
1. Design summary (1 абзац) — как football теперь гармонирует с basketball
2. Files changed (1 line each)
3. What was generalized vs football-only
4. Photo/assets added
5. Mobile vs desktop notes
6. Basketball regression notes

Язык ответа: русский. Код: английский.
```

## PROMPT END

---

## Короткая версия

```
Perfect Season Hub: bring FOOTBALL (38-0) UI to parity with existing BASKETBALL broadcast shell.

Mirror basketball patterns (SportBackdrop, ScoreBug, EdgeHeroes, phase-aware GameClient layout, PlayerPoolList, sticky SPIN) but keep football DNA: #00E676/#FFEA00, stadium+grass texture, 11 XI, OVR, G/A/CS, formation+difficulty, league→info→play funnel.

Remove PlayerCard photo gate (sport==="basketball"). Enable football portraits. Upgrade LineupBoard to SVG pitch + grass. Generalize PlayerPoolList filters (GK/DEF/MID/FWD).

Do NOT touch draft/simulation/API. Do NOT break basketball. Do NOT paint football orange.

Order: Backdrop grass → ScoreBug → EdgeHeroes → GameClient layout parity → PoolList → portraits → pitch SVG → league info cinematic → build.

Answer in Russian.
```

---

## Файлы-эталоны (читать перед работой)

| Файл | Зачем |
|------|--------|
| `src/components/game/GameClient.tsx` | `isBasketball` branches — зеркало для football |
| `src/components/basketball/ScoreBug.tsx` | HUD эталон |
| `src/components/basketball/EdgeHeroes.tsx` | Edge cutouts эталон |
| `src/components/game/SportBackdrop.tsx` | Atmosphere; добавить grass |
| `src/components/game/PlayerPoolList.tsx` | Pool UX эталон |
| `src/components/game/PlayerCard.tsx` | Убрать photo gate |
| `src/components/game/LineupBoard.tsx` | Pitch vs court |
| `src/app/[locale]/football/page.tsx` | League grid |
| `src/app/[locale]/football/[league]/page.tsx` | League info |
| `src/app/globals.css` | `[data-sport="football"]` tokens |

---

## Что сохранить уникальным у футбола

1. **OVR** на карточках (basketball скрывает — 82-0 parity).
2. **Formation picker** + **difficulty** на mode-select.
3. **Funnel** league select → league info → play.
4. **Chemistry multiplier** в ResultBreakdown (basketball показывает combo).
5. **Skip model** football (shared reroll pool, если так в коде) — не ломать логику, только UI.
6. **11 slots** на pitch — density через rows, не гигантские cards.
