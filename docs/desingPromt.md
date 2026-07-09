# Perfect Season Hub — Design Prompt (Gemini 3 Flash)

> Финальный промпт для визуального редизайна + интеграции реальных фото игроков.  
> Скопируй содержимое блока **PROMPT START → PROMPT END** и отправь Gemini 3 Flash.

---

## Аудит проекта (контекст)

| Факт | Значение |
|------|----------|
| Продукт | Fan-made веб-игра драфта легенд: футбол 38-0, NBA/NHL 82-0 |
| Stack | Next.js 16, React 19, Tailwind CSS v4, Framer Motion, lucide-react, html-to-image |
| Шрифты | Bebas Neue (display) + Inter (body, кириллица) |
| Игроки в данных | NBA ~420, Football ~1489, NHL ~845 |
| ID игроков | Разные форматы: `bill-russell-bos-1960s`, `nba-lakers-1980s-0` |
| Фото сейчас | 4 Unsplash-placeholder в `PlayerCard.tsx`, id **не совпадают** с JSON |
| `public/` | Нет фото игроков — только manifest.json и svg |
| Карточка | 80×80 квадрат, grayscale→color, силуэт User если нет фото |
| Темы | `data-sport` → CSS vars в `globals.css` |
| ShareCard | 1200×630 PNG через html-to-image |

### Маршруты (flow не менять)

- `/[locale]` — Hub (3 спорта)
- `/[locale]/football` — выбор лиги (EPL, La Liga, Serie A, Bundesliga, Ligue 1)
- `/[locale]/football/[league]` — info + Play
- `/[locale]/football/[league]/play` — игра
- `/[locale]/basketball/play`, `/[locale]/hockey/play` — игра
- Locales: `en`, `ru`

### Фазы GameClient (только визуал)

1. **mode-select** — Classic / Blind / Daily
2. **draft** — progress, LineupBoard, EraTracker, SlotMachine, SkipChips, PlayerCards, placement
3. **simulating** — loader
4. **result** — ResultBreakdown, Share, Play Again

### Данные игроков

**Тип** (`src/lib/types.ts`):

```ts
interface PlayerSeason {
  id: string;
  name: string;
  club: string;
  era: Era;
  positions: string[];
  stats: Record<string, number>;
  rating: number;
}
```

**JSON-файлы:**

- `data/basketball/nba.json` — ~420 записей
- `data/football/all.json` — ~1489 записей
- `data/hockey/nhl.json` — ~845 записей

**Эры и цвета** (`src/lib/config/eras.ts` → `ERA_COLORS`):

| Era | Color |
|-----|-------|
| 1950s | `#64748b` |
| 1960s | `#78716c` |
| 1970s | `#a16207` |
| 1980s | `#7c3aed` |
| 1990s | `#2563eb` |
| 2000s | `#059669` |
| 2010s | `#dc2626` |
| 2020s | `#00C853` |

**Sport themes** (`globals.css`):

| Sport | Primary | Secondary |
|-------|---------|-----------|
| Football | `#00E676` | `#FFEA00` |
| Basketball | `#FF9100` | `#651FFF` |
| Hockey | `#00B0FF` | `#F5F5F5` |

---

## PROMPT START

```
# РОЛЬ
Ты — арт-директор + frontend-дизайнер спортивных продуктов (уровень EA Sports broadcast / FUT·MyTEAM·HUT collectible cards).
Проект: **Perfect Season Hub** — fan-made веб-игра драфта легенд (футбол 38-0, NBA/NHL 82-0).

Tagline EN: «Draft legends. Chase the perfect record.»
Tagline RU: «Драфт легенд. Охота за идеальным сезоном.»
Disclaimer: fan project, not affiliated with leagues/clubs/players associations.

---

# ГРАНИЦЫ ЗАДАЧИ (КРИТИЧНО)

✅ ДЕЛАЙ:
- Визуальный дизайн, UI/UX polish, CSS, компоненты отображения
- Ассеты (фоны, текстуры, fallback plates)
- **Интеграция реальных фото игроков на карточках**
- Responsive mobile + desktop
- Design tokens, i18n-строки только для UI-лейблов
- Photo manifest, public/players/, PHOTO_CREDITS.md

❌ НЕ ТРОГАЙ:
- Game logic, draftReducer, spin.ts, validation
- Simulation engine, API routes (/api/simulate, /api/daily)
- Формулы rating, правила эр
- Loaders filter logic, seeds/data generation math

Механика (спин клуб+эра → выбор игрока → расстановка → симуляция) — **неизменна**.
Меняется только КАК это выглядит и КАК показываются фото реальных игроков.

---

<frontend_aesthetics>
Источник: Anthropic Cookbook — «Prompting for frontend aesthetics»
https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics

Ты склонен к generic «on distribution» выводам — «AI slop». Избегай этого: делай creative, distinctive frontends that surprise and delight.

**Typography:**
- Display: Bebas Neue (уже подключён) — hero, scores, CTA, brand «38-0»/«82-0»
- Extreme sizes: mobile 48–72px, desktop 96–120px для hero; contrast 200 vs 800 weight
- Body: Inter допустим (кириллица есть) ИЛИ один distinctive sans (Manrope / IBM Plex Sans) если улучшает RU
- Micro-labels: 10px uppercase, tracking 0.2em — broadcast lower-thirds, не SaaS dashboard
- Числа/рекорды: tabular, oversized, доминируют в кадре
- НЕ: Inter-only без display contrast, Space Grotesk, Arial, Roboto

**Color & Theme:**
- Base stadium night: #05070A bg, #0F1218 surface — НЕ purple gradient hero
- Sport themes через data-sport:
  • football: #00E676 + #FFEA00
  • basketball: #FF9100 + #651FFF accent (не фон)
  • hockey: #00B0FF + frost #F5F5F5
- Gold #FBBF24 — ТОЛЬКО rating ≥90 и perfect season
- Dominant + sharp accent; не равномерная радуга, не cliché purple-on-white

**Motion:**
- 3 hero-момента на flow, не micro-interaction на каждой кнопке:
  1. Hub load: staggered reveal карточек (80ms delay)
  2. Slot stop: deceleration + lock (broadcast cut, не casino reel)
  3. Perfect season: один gold flash + trophy beat (300ms)
- prefers-reduced-motion: статика, transitions 0.01ms
- БЕЗ: shimmer на каждой CTA, bounce на каждой иконке, particle spam

**Backgrounds & Depth:**
- Editorial sport photography + texture (grass/parquet/ice scratches)
- НЕ generic CSS mesh gradient, НЕ stock «smiling team» Unsplash
- Glass/blur — точечно (header, панели), не на всём экране
- EA FC triangle motif — subtle corner accents, не wallpaper pattern
- Vignette + 1 atmospheric layer достаточно

**Avoid generic AI-generated aesthetics:**
- Purple/blue gradient hero + white cards
- Identical rounded-2xl cards с одинаковым hover scale 1.02
- Glassmorphism stack на >50% экрана
- Lucide icon + glow + gradient button trilogy
- Lucide User silhouette как default для легенд
- Cookie-cutter dark mode SaaS
- Layout можно подставить под любой SaaS без изменений

Interpret creatively FOR sports broadcast context — как art direction реального спортивного продукта, не Midjourney mood board.
</frontend_aesthetics>

---

# DESIGN DIRECTION

**North star:** EA Sports broadcast arcade × FIFA Ultimate Team / NHL HUT / NBA 2K MyTEAM collectible cards × NBA 2K cinematic menus.

**Должно ощущаться:**
- Телевизионная трансляция (score bug, lower thirds, stat bars)
- Коллекционная карточка игрока (portrait cutout, OVR, era badge, rarity foil)
- Pre-match tunnel energy

**НЕ должно ощущаться:**
- Generic AI landing page / crypto dashboard
- Casino / lootbox gambling UI
- Template Tailwind dark theme
- Нейросетевой «AI slop»

---

# ГЛАВНАЯ ЗАДАЧА: РЕАЛЬНЫЕ ФОТО ИГРОКОВ НА КАРТОЧКАХ

## Проблема сейчас

`PlayerCard.tsx` содержит хардкод `PLAYER_IMAGES` с 4 Unsplash URL и id, которые **не совпадают** с `data/*.json`. Большинство карточек показывают силуэт `User` — главная UX-проблема.

## Цель

Каждая карточка показывает **узнаваемое фото реального человека** по `player.name` + контекст `club`/`era`, в стиле FUT/MyTEAM/HUT collectible card.

## 1. Структура файлов

```
public/
  players/
    basketball/
      magic-johnson.webp
      michael-jordan.webp
      lebron-james.webp
      _default.webp          ← sport fallback plate
    football/
      thierry-henry.webp
      cristiano-ronaldo.webp
      _default.webp
    hockey/
      wayne-gretzky.webp
      sidney-crosby.webp
      _default.webp
    _blind.webp              ← silhouette для blind mode
  backgrounds/
    football-stadium.webp
    basketball-arena.webp
    hockey-rink.webp
```

## 2. Manifest / resolver

Создай `src/lib/assets/player-photos.ts`:

```ts
// slug = normalize(name): lowercase, strip accents
// "LeBron James" → "lebron-james"
// "Thierry Henry" → "thierry-henry"

export function playerPhotoSlug(name: string): string;

export function getPlayerPhotoUrl(
  sport: "football" | "basketball" | "hockey",
  name: string,
  blind?: boolean,
): string;

// Lookup order:
// 1. manifest[playerPhotoSlug(name)] → /players/{sport}/{slug}.webp
// 2. fallback → /players/{sport}/_default.webp (initials plate, NOT User icon)
// 3. blind mode → /players/_blind.webp
```

**Важно:** маппинг по `player.name` (slug), **не по player.id** — форматы id inconsistent между sports.

Manifest можно генерировать из unique `name` в `data/*.json`.

## 3. Откуда брать фото (приоритет источников)

### Tier A — Wikimedia Commons (предпочтительно)

- Лицензии: CC BY-SA, CC BY, Public Domain
- Поиск: `{player name} {sport}` site:commons.wikimedia.org
- Скачать → crop upper body → WebP 400×500 → `public/players/{sport}/{slug}.webp`
- Attribution → `docs/PHOTO_CREDITS.md`

### Tier B — Wikipedia REST API

```
GET https://en.wikipedia.org/api/rest_v1/page/summary/{URL-encoded-name}
→ thumbnail.source
```

Download locally, convert to WebP. Не hotlink в production.

### Tier C — TheSportsDB (free, key "3")

```
GET https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p={name}
→ strCutout или strThumb
```

Проверять что `strTeam` близок к `player.club`. Convert PNG → WebP.

### Tier D — Curated MVP batch

Top ~30 legends per sport (rating ≥95 или iconic names):
Jordan, LeBron, Magic, Kareem, Kobe, Shaq, Bird, Duncan, Curry, Giannis…
Henry, Ronaldo, Messi, Zidane, Maldini, Beckham, Haaland, Salah…
Gretzky, Lemieux, Crosby, Ovechkin, McDavid, Brodeur, Roy…

Остальные → fallback plate с initials `{F}{L}` на sport gradient (**NOT AI face, NOT random stock athlete**).

## 4. Правовые ограничения

- Fan project; photos for identification/commentary
- **NO** official league logos (NBA, Premier League, NHL shield)
- **NO** EA/FIFA/2K trademarked card frame clones
- `docs/PHOTO_CREDITS.md`: source URL + license per slug
- Footer disclaimer уже есть — не удалять

## 5. Visual pipeline (единый для всех фото)

- Crop: upper body, shoulders up, face visible
- Source: 400×500 WebP
- Display: 88px mobile / 112px desktop width
- Background: dark gradient plate behind cutout
- Rest state: slight desaturate → full color on hover/select
- Era tint (optional): 8% opacity color grade per decade
- `object-fit: cover; object-position: top center`
- Use `next/image` with width/height

## 6. PlayerCard anatomy (FUT-style)

```
┌─────────────────────────────────────────┐
│ ┌──────────┐  THIERRY HENRY      [1990s]│
│ │          │  ST · FW · Arsenal         │
│ │  PHOTO   │  G 30  A 9                  │
│ │  cutout  │  OVR 93 ████████████░░      │
│ │  [93]    │                             │
│ └──────────┘                             │
└─────────────────────────────────────────┘
```

- Portrait zone: ~35% width, dark gradient plate
- OVR badge: overlapping bottom of photo — gold if ≥90, sport color otherwise
- Name: Bebas display uppercase
- Era pill: ERA_COLORS
- Positions + club: micro chips
- Stats: broadcast chips (G/A/PPG/RPG etc. per sport)
- Selected: border sport + glow-sport
- 90+: gold foil edge (CSS gradient border)
- Blind: silhouette + «???», stats hidden, flip reveal on select

## 7. LineupBoard mini portraits

Filled slots: circular cutout 24px from same manifest, or initials if no photo.

## 8. ShareCard roster strip

Bottom row: mini player cutouts from manifest for PNG export (1200×630).

---

# ФАЙЛЫ — ЧТО МОЖНО МЕНЯТЬ

| Файл | Задача |
|------|--------|
| `src/app/globals.css` | tokens, keyframes, sport textures, utilities |
| `src/components/game/PlayerCard.tsx` | FUT card + photo via manifest |
| `src/components/game/SlotMachine.tsx` | broadcast draft drums |
| `src/components/game/GameClient.tsx` | responsive, sticky mobile CTA |
| `src/components/game/LineupBoard.tsx` | pitch polish + mini portraits |
| `src/components/game/ResultBreakdown.tsx` | broadcast scoreboard |
| `src/components/game/SportCard.tsx` | cinematic sport tiles |
| `src/components/game/ShareCard.tsx` | player photo strip |
| `src/components/game/EraTracker.tsx` | visual polish |
| `src/components/game/SkipChips.tsx` | visual polish |
| `src/app/[locale]/page.tsx` | hub hero |
| `src/app/[locale]/football/page.tsx` | league grid tiles |
| `src/app/[locale]/football/[league]/page.tsx` | match hub style (сейчас plain) |
| `src/components/layout/Header.tsx` | responsive header |
| `src/components/layout/Footer.tsx` | minimal |
| `src/lib/i18n/dictionaries.ts` | UI strings (move hardcoded EN) |
| `src/lib/assets/player-photos.ts` | **NEW** photo resolver |
| `public/players/**` | **NEW** webp assets |
| `docs/design-tokens.md` | sync if tokens change |
| `docs/PHOTO_CREDITS.md` | **NEW** attribution |
| `scripts/fetch-player-photos.mjs` | **NEW optional** batch fetch |

**НЕ ТРОГАТЬ:** `src/lib/game/*`, `src/lib/simulation/*`, `src/app/api/*`, `scripts/seeds/*`, `scripts/generate-data.ts` logic

---

# RESPONSIVE — MOBILE И DESKTOP

Test frames: **390×844** (iPhone), **768×1024** (iPad), **1440×900** (desktop).

## Mobile (320–639px)

| Экран | Spec |
|-------|------|
| Hub | 1 col sport cards, hero text-5xl «PERFECT» + accent «SEASON» |
| Draft | single column: Board → Era → Slot → Skip → Cards |
| SPIN | sticky bottom bar, glass, safe-area-inset-bottom |
| PlayerCard | full width, photo min 88px |
| Mode select | full width tiles, touch min 48px |
| Result | vertical buttons |
| Header | logo + EN/RU, hide tagline |

## Desktop (≥1024px)

| Экран | Spec |
|-------|------|
| Hub | 3 col cards h~280px, hero text-9xl |
| Draft | `lg:grid-cols-[1fr_380px]`, board sticky top-24, cards scroll max-h 60vh |
| Mode select | max-w-xl, brand text-8xl |
| PlayerCard | photo 112px |
| Result | 2-col share/replay |

## Tablet (640–1023px)

- max-w-2xl centered
- 2-col metrics on result, league grid 2-col

---

# ЭКРАНЫ — DESIGN SPEC

## 1. Hub (`/[locale]`)

- Hero: PERFECT + SEASON (sport green glow on SEASON)
- 3 SportCard: editorial BG per sport, gradient bottom-up overlay, brand pill
- Single ambient radial glow — not everywhere

## 2. Football leagues

- Grid tiles: league name, match count, brand 38-0
- `football/[league]/page` — привести к tile style (сейчас plain text)

## 3. Mode Select

- Classic: primary filled tile (MAIN EVENT)
- Blind: outlined secondary
- Daily: sport/10 bg + border accent

## 4. Draft

- Progress: «3/11» display font + sport progress bar with glow
- LineupBoard: sport pitch (football green / basketball wood / hockey ice)
- SlotMachine: glass drums, center selection band, SPIN hero CTA (no infinite shimmer)
- PlayerCards: **главный фокус** — real photos, FUT anatomy

## 5. Result

- Score bug: wins-losses largest (text-5xl mobile / text-7xl desktop)
- Perfect: gold trophy, one celebration beat
- Weakest category: red broadcast «weak link»
- Chemistry: electric zap accent
- ShareCard must render photos in html-to-image export

---

# ПЛАН ВНЕДРЕНИЯ ФОТО

**Phase 1 — Infrastructure**
1. `playerPhotoSlug()` + resolver
2. Sport fallback plates `_default.webp`
3. Wire `PlayerCard` — remove hardcoded `PLAYER_IMAGES`
4. `next/image` for all player photos

**Phase 2 — MVP (~30 per sport)**
5. Fetch top legends from Wikimedia/TheSportsDB → WebP
6. Write `PHOTO_CREDITS.md`

**Phase 3 — Scale**
7. Script: unique names from `data/*.json` → batch fetch → skip if not found
8. LineupBoard + ShareCard mini portraits

**Phase 4 — Polish**
9. Era tint, gold foil, blind silhouette, hover color reveal
10. Mobile sticky SPIN, desktop sticky board
11. Move hardcoded EN strings to `dictionaries.ts`

---

# ANTI AI-SLOP CHECKLIST

Before done, verify NONE of these:

- [ ] Purple gradient hero
- [ ] Every component identical border-radius + hover scale
- [ ] Glass blur on >50% screen
- [ ] Three glowing buttons same style in a row
- [ ] Generic dark card, no hierarchy
- [ ] Inter-only, no display contrast
- [ ] Stock photo «random athlete» aesthetic
- [ ] Shimmer on every CTA
- [ ] AI illustration flat vector players
- [ ] Lucide User icon for legends without photo
- [ ] Layout swappable to any SaaS without changes

---

# SELF-CHECK

**Design:**
- [ ] Not AI slop
- [ ] 3 sport themes via data-sport
- [ ] Mobile SPIN reachable without scroll
- [ ] Desktop board + sidebar visible together

**Photos:**
- [ ] Real photo for MVP legends (Jordan, LeBron, Henry, Gretzky…)
- [ ] Fallback = initials plate, NOT User icon
- [ ] Blind = silhouette, no identity
- [ ] PHOTO_CREDITS.md created
- [ ] Local WebP in public/players/, no Unsplash hotlink for players

**Integrity:**
- [ ] draftReducer / simulation / API unchanged
- [ ] `npm run build` passes
- [ ] EN + RU no overflow on 390px header

---

# OUTPUT FORMAT (твой ответ)

1. **Design summary** — 1 абзац creative direction
2. **Token table** — colors, type scale, spacing, radii
3. **Photo pipeline doc** — slug rules, sources, fallback chain
4. **Files changed** — 1 line each
5. **MVP photo list** — ~30 players per sport, source URL each
6. **Mobile vs Desktop** — key differences
7. **PHOTO_CREDITS.md** content

Язык ответа: **русский**. Код и комментарии: **английский**.
```

## PROMPT END

---

## Короткая версия (если не влезает в контекст)

```
Perfect Season Hub — fan sports draft game. Redesign UI to EA Sports broadcast + FUT card style.
Avoid AI slop (Anthropic frontend_aesthetics): no purple gradients, no glow everywhere, no User silhouette for legends.

MAIN TASK: integrate REAL player photos on PlayerCard using player.name slug → public/players/{sport}/{slug}.webp.
Sources: Wikimedia Commons → Wikipedia API → TheSportsDB → initials fallback plate.
Create src/lib/assets/player-photos.ts, PHOTO_CREDITS.md, MVP ~30 photos per sport.

DO NOT touch: draftReducer, spin, simulation, API, validation.

Responsive: mobile 390px (sticky SPIN, single col) + desktop 1440px (2-col draft, sticky board).
Files: globals.css, PlayerCard, GameClient, LineupBoard, SlotMachine, ResultBreakdown, SportCard, ShareCard, Header, football pages.

Output in Russian. Code in English. npm run build must pass.
```

---

## Ссылки

- [Anthropic — Prompting for frontend aesthetics](https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics)
- [Anthropic — Prompting best practices (Frontend design)](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices)
- Design tokens проекта: `docs/design-tokens.md`
- Data plan: `docs/data-collection-plan.md`
