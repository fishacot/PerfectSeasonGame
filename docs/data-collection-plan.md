# План сбора данных — Perfect Season Hub

Документ описывает, как перейти от курируемых seed-данных (`scripts/seeds/`) к полноценной базе реальной статистики для всех команд × эр, используемых в игре.

## 1. Текущее состояние (после аудита)

### Корневая причина багов

1. **Клонирование игроков** — старый `expandNBA()` / `expandFootball()` / `expandNHL()` брал 2–3 шаблонных игрока из Lakers+Bulls (и аналогов) и **копировал их на все остальные клубы**, меняя только поле `club`. Отсюда LeBron James и Jimmy Butler у Houston Rockets.
2. **Маленький пул** — `slice(0, 2)` давал ровно **2 кандидата** на спин (клуб + эра).
3. **Логика спина корректна** — `getPlayersForSpin()` фильтрует по `club` и `era`; проблема была в данных, не в `spin.ts`.

### Что исправлено сейчас (MVP)

- Удалено клонирование; каждый игрок привязан к реальному клубу в seed-файлах.
- ~4 игрока на комбинацию клуб+эра (где есть история клуба).
- `spinTeamEraWithPool()` — переброс спина, если пул < 3 (команды без истории в ранних эрах).
- Валидация при генерации: предупреждение о «тонких» пулах.

---

## 2. Схема данных

### `PlayerSeason` (уже в `src/lib/types.ts`)

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | `string` | Уникальный ключ: `{sport}-{club}-{era}-{slug}` |
| `name` | `string` | Отображаемое имя |
| `club` | `string` | Должен совпадать с клубом в `SpinResult.club` |
| `era` | `Era` | Декада (`1960s` … `2020s`) |
| `positions` | `string[]` | Позиции для драфта (PG, ST, G, …) |
| `stats` | `Record<string, number>` | Сырые статы эры (см. ниже) |
| `rating` | `number` | 0–99, для сортировки пула и симуляции |

### Статистика по видам спорта

| Спорт | Поля `stats` | Категории симуляции |
|-------|----------------|---------------------|
| Basketball | `ppg`, `rpg`, `apg`, `spg`, `bpg` | PTS, REB, AST, STL, BLK |
| Football | `goals`, `assists`; GK: `cleanSheets` | GK, DEF, MID, ATT |
| Hockey | `goals`, `assists`; G: `savePct` | Attack, Defense, Goaltending |

### Рекомендуемые поля для пайплайна (не в UI пока)

```ts
type PlayerSeasonSource = {
  playerId: string;       // стабильный ID (bbref, fbref, hr)
  seasonStartYear: number; // 2018 → era "2010s" via seasonToEra()
  teamId: string;         // нормализованный клуб
  minutesPlayed?: number; // для фильтра «значимый сезон»
  source: string;         // "basketball-reference", …
  fetchedAt: string;      // ISO date
};
```

---

## 3. Маппинг эр

Используется `seasonToEra()` из `src/lib/config/eras.ts`:

- Сезон **2018–19** → `seasonStartYear: 2018` → эра **`2010s`**
- Правило: `Math.floor(seasonStartYear / 10) * 10 + "s"`

### Матрица охвата (целевая)

| Спорт | Клубы | Эры | Комбинаций | Игроков/комбо (цель) | Итого записей |
|-------|-------|-----|------------|----------------------|---------------|
| NBA | 15 | 7 (`1960s`–`2020s`) | 105 | 6–12 | ~800–1200 |
| Football (топ-5) | 30 | 4–5 (`1980s`–`2020s`) | ~135 | 8–15 | ~1200–2000 |
| NHL | 12 | 8 (`1950s`–`2020s`) | 96 | 6–12 | ~600–1000 |

Эры заданы в `src/lib/config/eras.ts`; футбол La Liga / Serie A используют `FOOTBALL_ERAS_EXTENDED` (+ `1980s`).

---

## 4. Источники данных

### NBA — Basketball Reference

- URL: https://www.basketball-reference.com
- Данные: сезонные per-game, команда, позиция, минуты.
- API: официального нет; **stats.nba.com** нестабилен без ключей.
- Варианты: ручной CSV-экспорт, `basketball-reference-scraper` (Python), или платный SportsRadar / balldontlie (ограниченно).

### Football — FBref / Transfermarkt

- **FBref**: https://fbref.com — голы, ассисты, минуты, лига, сезон (лучший для статов).
- **Transfermarkt**: трансферы и составы (проверка «играл ли в клубе»).
- API: официального нет у FBref; соблюдать robots.txt и rate limits.

### NHL — Hockey Reference

- URL: https://www.hockey-reference.com
- Данные: goals, assists, save%, команда, сезон.
- Аналогично NBA: скрапинг или CSV.

### Правовые заметки

- Sports Reference (BBR, FBref, HR): некоммерческое / research использование обычно терпимо; **массовый скрапинг** — проверить ToS, ставить задержки 2–5 с, кешировать локально.
- Для продакшена рассмотреть лицензированные API (Sportradar, API-Football, NHL API).
- **Не клонировать** игроков на клубы — только записи с подтверждённым `teamId` за сезон.

---

## 5. Пайплайн

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│ Fetch       │───▶│ Normalize    │───▶│ Era + Club  │───▶│ Rating       │
│ (per sport) │    │ team names   │    │ mapping     │    │ formula      │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
                                                              │
                                                              ▼
                                                    ┌──────────────────┐
                                                    │ data/{sport}/*.json │
                                                    │ + validate pools │
                                                    └──────────────────┘
```

### Шаги

1. **Fetch** — по сезону и лиге, сырой JSON/CSV в `data/raw/{sport}/`.
2. **Normalize** — таблица алиасов клубов (`Houston Rockets` → `Rockets`, `Man Utd` → `Manchester United`).
3. **Era mapping** — `seasonToEra(seasonStartYear)`.
4. **Position mapping** — правила в `src/lib/config/sports.ts` → `positions[]`.
5. **Фильтр** — мин. игр/минут за сезон (NBA: ≥20 GP или ≥15 MPG; футбол: ≥10 матчей; NHL: ≥20 GP).
6. **Rating** — нормализация внутри (клуб, эра, позиция), см. §6.
7. **Validate** — как `validatePool()` в `generate-data.ts`: каждая (клуб, эра) ≥ 3 игроков.
8. **Write** — `data/basketball/nba.json`, `data/football/all.json`, `data/hockey/nhl.json`.

### BBR verification harness (iteration 7)

**Правило канонического сезона:** для каждой пары franchise×decade в reference — один peak season внутри декады (MVP/championship year или лучший stat line). Указывается в поле `season` (например `2013-14`).

```
scripts/bbr-reference/*.json   # curated BBR stat lines
scripts/validate-nba-stats.mjs # npm run validate:nba — exit 1 on mismatch > 0.5
```

Overrides применяются в `generate-data.ts` → `applyBbrToPlayers()` после merge/dedupe.

Аналог для футбола: `scripts/fbref-reference/` + `npm run validate:football`.

### Структура скриптов (предлагаемая)

```
scripts/
  generate-data.ts          # текущий: seeds → JSON
  seeds/                    # курируемые MVP-ростеры
  pipeline/
    fetch-nba.ts            # фаза 2: сырьё
    fetch-football.ts
    fetch-nhl.ts
    normalize-clubs.ts      # общие алиасы
    build-ratings.ts
    merge-to-json.ts
  config/
    club-aliases.json
    min-thresholds.json
```

Зависимости: по возможности **только Node + fetch**; Python-скраперы — отдельный опциональный шаг с выводом в `data/raw/`.

---

## 6. Формула рейтинга (черновик)

Цель: 75–99 для звёзд эры, без внешних API.

### Basketball

```
rating = clamp(50 + 2.2*ppg + 0.9*rpg + 1.1*apg + 2*spg + 1.5*bpg, 75, 99)
```

Калибровка по перцентилям внутри (клуб, эра).

### Football (полевой)

```
rating = clamp(50 + 1.8*goals + 1.0*assists, 70, 96)
```

GK: `rating = clamp(70 + 1.2*cleanSheets, 75, 94)`.

### Hockey (скатер)

```
rating = clamp(50 + 0.9*goals + 0.5*assists, 70, 99)
```

G: `rating = clamp(70 + 25*(savePct - 0.88), 75, 98)`.

---

## 7. Фазы внедрения

### Фаза A — MVP (сделано)

- [x] Убрать клонирование
- [x] Seed-ростеры с реальными игроками (~4/комбо)
- [x] Guard на пул < 3 при спине
- [ ] Юнит-тест: Rockets + 2010s не содержит LeBron

### Фаза B — Расширенные seeds (1–2 недели, ручная курация)

- 8+ игроков на популярные комбо (Lakers, Real, Canadiens)
- Таблица `club-aliases.json`
- Скрипт импорта одного сезона с CSV (ручной экспорт BBR)

### Фаза C — Полуавтомат (2–4 недели)

- Fetcher для одного спорта (NBA приоритет)
- Кеш в `data/raw/`
- Еженедельный regen: `npm run data:generate`

### Фаза D — Полный датасет (1–2 месяца)

- Все команды × все эры
- Реальные сезонные статы, не карьерные хайлайты
- CI-проверка: min pool, no duplicate wrong-club

### Оценка трудозатрат

| Фаза | Часы | Автоматизация |
|------|------|---------------|
| A (фикс архитектуры) | 4–8 | — |
| B (ручные seeds) | 20–40 | низкая |
| C (1 спорт, скрапинг) | 40–80 | средняя |
| D (3 спорта, production) | 120–200 | высокая |

---

## 8. Дизайн vs данные

Проблема «сырого» UI в основном **не из данных**:

| Уже есть | Нужно улучшить |
|----------|----------------|
| Design tokens (`docs/design-tokens.md`) | Карточки игроков: фото/силуэт, бейдж эры |
| Sport themes | Анимация спина (slot machine), не только список |
| i18n RU/EN | Пустые состояния, скелетоны загрузки |
| Framer Motion | Типографика заголовков (Bebas Neue подключить) |

**Приоритет:** сначала достоверные данные и пул 4–8 игроков; затем polish UI (карточка игрока, spin reveal, lineup summary). Без правильных `club`/`era` дизайн не спасёт доверие пользователя.

---

## 9. Команды для запуска

```bash
# Регенерация JSON из seeds
npx tsx scripts/generate-data.ts

# Сборка приложения
npm run build
```

После фазы C добавить в `package.json`:

```json
"data:fetch": "tsx scripts/pipeline/fetch-all.ts",
"data:generate": "tsx scripts/generate-data.ts"
```

---

## 10. Критерии готовности данных

- [ ] Ни один игрок не привязан к клубу, где не играл в эту эру
- [ ] ≥ 3 кандидатов на 95%+ комбинаций (клуб × эра) в активном пуле лиги
- [ ] Средний пул ≥ 5 для NBA / football / NHL
- [ ] `npm run build` проходит; loaders не фильтруют «чужие» клубы ошибочно
