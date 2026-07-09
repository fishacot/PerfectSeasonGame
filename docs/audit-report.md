# Аудит Perfect Season Hub

**Дата:** 7 июля 2026  
**Версия:** 0.1.0 (Next.js 16.2.10)  
**Метод:** статический анализ кода, выборочная проверка JSON, `npm run build`, `npx tsx src/lib/simulation/engine.ts`, перегенерация данных `npx tsx scripts/generate-data.ts`

---

## Краткое резюме

- **Сборка проходит** (`npm run build` — OK). Игровой цикл (спин → выбор → расстановка → симуляция → результат) реализован и в целом работает.
- **Данные частично исправлены:** сиды в `scripts/seeds/` корректны, но **закоммиченные JSON были устаревшими** (шаблонное клонирование → LeBron в Rockets). После `generate-data.ts` LeBron только Lakers/Heat; объём вырос до **529 / 396 / 308** игроков.
- **`docs/data-collection-plan.md` отсутствует** — задача предыдущего субагента не завершена.
- **i18n и UX сырые:** ~60% UI на английском даже на `/ru`; `html lang="en"` всегда; страницы «Как играть» нет.
- **Несколько фич заявлены, но не доделаны:** импорт challenge-ссылки, лимит «одна попытка» в Daily, баннер Daily, валидация эр перед симуляцией.

---

## 1. Аудит данных

### 1.1 Источники и пайплайн

| Файл | Назначение |
|------|------------|
| `scripts/generate-data.ts` | Сборка JSON из сидов + `validatePool` (предупреждения о «тонких» пулах) |
| `scripts/seeds/football.ts` | Курируемые составы топ-5 лиг |
| `scripts/seeds/nba.ts` | 15 команд × 7 эр, ~4 игрока на ячейку |
| `scripts/seeds/hockey.ts` | 12 команд × 8 эр |
| `data/football/all.json` | Единый пул, фильтрация по лиге в `loaders.ts` |
| `data/basketball/nba.json` | NBA |
| `data/hockey/nhl.json` | NHL |

**Важно:** в репозитории лежали **старые JSON** (196 NBA-записей с клонированием легенд по всем клубам). Актуальный генератор использует сиды без клонирования. При аудите данные перегенерированы.

### 1.2 Объём и покрытие (после регенерации)

| Спорт | Игроков | Клубов | Эры | Ячеек club×era | min / max на ячейку |
|-------|---------|--------|-----|----------------|---------------------|
| Футбол | 529 | 30 | 1980s–2020s | ~150 | 0–4 |
| NBA | 396 | 15 | 1960s–2020s | 105 | 0–4 |
| NHL | 308 | 12 | 1950s–2020s | 96 | 0–4 |

### 1.3 Проверка привязки игрок → клуб

| Проверка | До регенерации | После регенерации |
|----------|----------------|-------------------|
| LeBron James | 14 клубов, в т.ч. **Rockets** | Lakers (2010s, 2020s), Heat (2010s) — **корректно** |
| Michael Jordan | 14 клубов (клоны) | Только Bulls (+ корректные эры в сидах) |
| Wayne Gretzky | Размазан по клубам | Oilers |

**Вывод:** баг LeBron/Rockets был следствием **устаревшего JSON**, а не текущего генератора. Риск повторения: если забыть запускать `generate-data.ts` после правки сидов.

### 1.4 Покрытие по лигам (футбол)

| Лига | Игроков в пуле | Пустые ячейки club×era |
|------|----------------|------------------------|
| EPL | 83 | 0 |
| La Liga | 99 | 4 (в основном **1980s** у клубов без сида) |
| Serie A | 108 | 3 |
| Bundesliga | 84 | 4 |
| Ligue 1 | 84 | 4 |

EPL использует эры 1990s–2020s — покрытие полное. Лиги с `extendedEras: true` страдают от **отсутствия 1980s** у ряда клубов (Arsenal, Bayern и др. в сидах не имеют 1980s).

### 1.5 Предупреждения `validatePool` (< 3 игроков на ячейку)

- **Футбол:** 18 тонких пулов (все — **1980s** у клубов без курируемых данных).
- **NBA:** 6 пулов (Heat 1960s/1970s, Nets 1960s, Mavericks 1960s/1970s, Nuggets 1960s) — **0 игроков**.
- **NHL:** 19 пулов (ранние эры у молодых франшиз: Oilers 1950s, Avalanche 1950s–1970s, Lightning 1950s–1980s и т.д.).

### 1.6 Качество курируемых данных

| Проблема | Серьёзность | Пример |
|----------|-------------|--------|
| Неточная эра (игрок в «не своём» десятилетии) | **High** | Thierry Henry в Arsenal **1990s** (пик — 2000s); Bruno Fernandes в Man United **2010s** (пришёл в 2020); Mohamed Salah в Liverpool **2010s** (граничный случай) |
| Пустой пул при спине | **High** | Спин `Mavericks/1960s` → 0 игроков → мягкий лок игры |
| Мало защитников NHL с позицией `D` | **Medium** | 59 игроков с `D` на 12 команд × 8 эр; при спине без D-слота симуляция занижает Defense |
| Нет `docs/data-collection-plan.md` | **High** | План сбора данных не создан |
| Нет CI-хука на регенерацию JSON | **Medium** | Расхождение сидов и JSON повторится |

### 1.7 Пробелы vs MVP

| Требование MVP | Статус |
|----------------|--------|
| Топ-5 лиг футбола | ✅ Структура есть, данные частично |
| 3+ игрока на club×era | ⚠️ 18+6+19 ячеек ниже порога |
| Исторически верные клубы | ✅ После регенерации (сиды) |
| NBA 15 команд | ✅ |
| NHL 12 команд | ✅ |
| Реалистичные статы | ⚠️ Упрощённые, без внешних источников |
| Документированный план данных | ❌ Отсутствует |

---

## 2. Архитектура и структура сайта

### 2.1 Маршруты

```
/                          → редирект middleware → /en
/[locale]                  → хаб выбора спорта
/[locale]/football         → выбор лиги
/[locale]/football/[league]→ лендинг лиги + правила
/[locale]/football/[league]/play → GameClient
/[locale]/basketball       → лендинг (есть, но хаб ведёт мимо)
/[locale]/basketball/play  → GameClient
/[locale]/hockey           → лендинг (есть, но хаб ведёт мимо)
/[locale]/hockey/play      → GameClient
/[locale]/privacy          → privacy
/api/simulate              → POST симуляция
/api/daily                 → GET детерминированные спины
```

**Несогласованность:** с хаба футбол идёт на `/football` (выбор лиги), баскетбол и хоккей — **сразу на `/play`**, минуя лендинги с правилами.

### 2.2 Иерархия компонентов

```
layout.tsx (шрифты, metadata)
└── [locale]/layout.tsx
    ├── Header (i18n переключатель)
    ├── main
    │   └── страницы / GameClient
    └── Footer

GameClient (draftReducer)
├── SportThemeProvider
├── SlotMachine
├── SkipChips
├── PlayerCard
├── LineupBoard
├── EraTracker
├── ResultBreakdown
└── ShareCard (off-screen для PNG)
```

Логика игры сосредоточена в `draft-state.ts` + `validation.ts` + `spin.ts`. Симуляция: `run.ts` → адаптеры по спорту → `engine.ts`.

### 2.3 i18n

| Аспект | Статус |
|--------|--------|
| Словари `en` / `ru` | ✅ Базовые ключи |
| Хаб, футер, кнопки режимов | ✅ / ⚠️ |
| GameClient (Draft Progress, Available Talent, SEASON COMPLETE…) | ❌ Hardcoded EN |
| EraTracker, ResultBreakdown, ShareCard | ❌ Hardcoded EN |
| `html lang` | ❌ Всегда `en` в `layout.tsx` |
| `howToPlay` в словаре | ⚠️ Ключ есть, **страницы нет** |
| `dailyBanner` в словаре | ⚠️ Ключ есть, **в UI не показывается** |

Оценка покрытия i18n: **~40%** пользовательского текста в игровом потоке.

### 2.4 Адаптивность и дизайн

| Аспект | Оценка |
|--------|--------|
| Mobile layout | ⚠️ `LineupBoard` уменьшает слоты на `sm`, но на узких экранах поле + сайдбар (`lg:grid-cols`) складывается в колонку — играбельно, но длинный скролл |
| Touch targets | ⚠️ Мелкие чипы эр (~40px), кнопки позиций ок |
| Темы по спорту | ✅ `SportThemeProvider` + CSS variables |
| Визуальная полировка | **Сыро** — generic dark UI, stock Unsplash в CSS, 4 хардкод-картинки игроков, нет единства с `design-tokens.md` (другие hex-значения) |
| Анимации | ✅ framer-motion в SlotMachine, CSS transitions |
| PWA | ⚠️ `manifest.json` есть, глубокой интеграции не проверялось |

**Честная оценка дизайна:** функциональный прототип в стиле «stadium arcade», не продуктовый polish. Пользователь прав — сайт raw.

---

## 3. Матрица функций

| Функция | Статус | Заметки |
|---------|--------|---------|
| Выбор спорта на хабе | **PASS** | 3 карточки, ссылки работают |
| Футбол: выбор лиги → play | **PASS** | 5 лиг, фильтрация пула в loader |
| Баскетбол play | **PASS** | Прямой вход с хаба |
| Хоккей play | **PASS** | Прямой вход с хаба |
| Режим Classic | **PASS** | mode-select → START |
| Режим Blind | **PASS** | Скрывает статы в `PlayerCard` |
| Режим Daily | **PARTIAL** | API отдаёт спины; скипы отключены; **нет лимита 1 попытка**, баннер не показан |
| Спин клуб+эра | **PASS** | Анимация 1.2s, затем SPIN action |
| Выбор игрока | **PARTIAL** | Работает; при пустом пуле — тупик |
| Расстановка по позиции | **PASS** | `canPlaceAtPosition` с группами позиций |
| Симуляция → результат | **PASS** | POST `/api/simulate`, breakdown |
| Валидация эр | **PARTIAL** | `canPickPlayer` при выборе ✅; `isRosterEraValid` **нигде не вызывается** перед симуляцией |
| Skip Team / Skip Era | **PASS** | По 1 разу, скрыты в Daily |
| Share card (PNG) | **PARTIAL** | `html-to-image` + download; текст EN; CSS vars off-screen могут не отрендериться в части браузеров |
| Copy Challenge | **PARTIAL** | Копирует URL с `?challenge=`, но **импорт не реализован** |
| `/api/simulate` | **PASS** | Валидация sport + lineup; без проверки размера состава |
| `/api/daily` | **PASS** | Детерминированный seed по дате |
| Engine self-check | **PASS** | `npx tsx src/lib/simulation/engine.ts` → ok |
| `npm run build` | **PASS** | Предупреждение: middleware deprecated → proxy |

---

## 4. Приоритизированный roadmap

### P0 — Критично (ломает доверие / геймплей)

1. **Зафиксировать пайплайн данных:** `npm run generate-data` в package.json + проверка в CI, что JSON соответствует сидам.
2. **Заполнить пустые ячейки club×era** (NBA 1960s у Heat/Mavs, NHL ранние эры) — иначе спины в пустоту.
3. **Создать `docs/data-collection-plan.md`** — источники, лицензии, критерии эры, объём на клуб.
4. **Блокировать симуляцию при невалидных эрах** — вызвать `isRosterEraValid` в `PLACE` (последний пик) или в API.

### P1 — Высокий (MVP-полнота)

5. **Импорт challenge URL** — парсинг `?challenge=` в `GameClient` / play pages.
6. **Daily: одна попытка** — localStorage/cookie по дате + UI баннер (`dailyBanner`).
7. **i18n игрового UI** — вынести ~30 строк из GameClient/EraTracker/ResultBreakdown в словари.
8. **`html lang={locale}`** на layout или `[locale]`.
9. **Пройтись по эрам в футбольных сидах** — Henry, Bruno, Salah и др.

### P2 — Средний (качество)

10. Страница **How to Play** (`dict.howToPlay`).
11. Единый путь навигации: хаб → лендинг спорта → play (как у футбола).
12. NHL: больше игроков с позицией `D` в ранних эрах.
13. ShareCard: локализация + fallback без CSS variables для PNG.
14. Страница privacy — проверить контент и ссылку из футера (сейчас футер без ссылки).

### P3 — Низкий (polish)

15. Привести `globals.css` к `design-tokens.md`.
16. Реальные фото/силуэты или единый placeholder.
17. Тесты (хотя бы smoke на reducer + API).
18. Миграция middleware → proxy (Next.js 16).

---

## 5. Что сделано во время аудита

- `npm run build` — успешно.
- `npx tsx src/lib/simulation/engine.ts` — self-check ok.
- **`npx tsx scripts/generate-data.ts`** — перегенерированы JSON (устранён рассинхрон с сидами; LeBron/Rockets в актуальных данных больше нет).

Коммит **не создавался** (по инструкции).

---

## Приложение: команды для повторной проверки

```bash
npm run build
npx tsx scripts/generate-data.ts
npx tsx src/lib/simulation/engine.ts
```
