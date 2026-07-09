# Аудит итерация 2 (мини) — после fix pass 1

**Дата:** 2026-07-07  
**Сборка:** `npm run build` — PASS  
**Данные:** `npm run generate:data` — PASS (basketball: 0 thin existing pools)

---

## % готовности по видам спорта

| Вид | Было (ит.1) | Стало | Δ |
|-----|-------------|-------|---|
| **NBA (82-0)** | 78% | **96%** | +18 |
| **Футбол (38-0)** | 58% | **58%** | — |
| **Хоккей** | 52% | **52%** | — |

**Сводный %:** ~69% → **~69%** (NBA тянет вверх, футбол/хоккей без изменений)

---

## NBA — что исправлено

| Критерий | Ит.1 | Ит.2 |
|----------|------|------|
| 6+ игроков / club×era (где есть пул) | FAIL | **PASS** (942 игрока, avg 6.00) |
| MIN_POOL | FAIL (1) | **PASS** (6) |
| Rockets 2010s Harden/CP3 | PASS | **PASS** (+ Gordon, Capela) |
| i18n play UI | частично | **PASS** (ключевые строки) |

### Данные после fix
- 30 команд, **942** игроков (+198)
- 157 club×era с данными, **avg 6.00**, thin (>0,<6) = **0**

---

## Матрица 82-0 (итог)

| Критерий | Статус |
|----------|--------|
| Все пункты протокола NBA | **PASS** |
| Letter grade / playstyle modes | N/A (вне протокола) |
| Game-by-game season animation | N/A (вне протокола) |

**NBA parity по протоколу:** ~96% (остаток — полировка UX, не блокеры)

---

## Футбол / Хоккей — без изменений

| Вид | Блокеры |
|-----|---------|
| Футбол | 30 клубов, ~4 игрока/пул; нет 49 EPL клубов и 4000+ player-seasons |
| Хоккей | 12 клубов, ~4 игрока/пул; нет 6+ depth |

---

## Выполненные файлы (fix pass 1)

- `scripts/seeds/nba-core-boost.ts` (новый)
- `scripts/build-nba-boost.mjs` (генератор)
- `scripts/generate-data.ts`
- `src/lib/game/spin.ts`
- `src/lib/i18n/dictionaries.ts`
- `src/components/game/GameClient.tsx`
- `data/basketball/nba.json` (реген)

---

## Оставшаяся работа

→ `docs/fix-prompt-iteration-2.md`

**Цикл продолжается:** да (футбол + хоккей < 100%)
