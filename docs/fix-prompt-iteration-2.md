# Fix Prompt — Итерация 2 (для следующего цикла)

## P1 — Футбол: углубление пулов

**Файлы:** `scripts/seeds/football.ts`, `scripts/generate-data.ts`

**Действие:**
1. Довести существующие club×era до **6 игроков** (как `nba-core-boost`)
2. Расширить EPL с 8 до **минимум 20** клубов (Arsenal, Chelsea, Liverpool, City, United, Spurs, Newcastle, Villa + Leeds, Everton, West Ham, Brighton, Wolves, Crystal Palace, Fulham, Bournemouth, Nottm Forest, Leicester, Southampton, Ipswich, Sunderland)

**Критерий:** avg ≥ 5 игроков/club×era для EPL; `npm run build` PASS

---

## P1 — Хоккей: 6 игроков / club×era

**Файлы:** `scripts/seeds/hockey.ts`, `scripts/generate-data.ts`

**Действие:** +2 depth на каждый существующий пул; расширить до **16–20** NHL клубов

**Критерий:** avg ≥ 6 для существующих комбинаций; 6 слотов × 6 эр играбельны

---

## P2 — Футбол: сезонная гранулярность (опционально)

38-0 использует **сезоны** (1992–93…), не декады. Для parity v2: `season` поле + спин по сезону. Вне scope текущего протокола — отложить.

---

## P3 — Полировка NBA (опционально)

- Blind mode label → «HoopIQ» в UI кнопке (`dict.blind`)
- Letter grade в `ResultBreakdown` (A/B/C как 82-0-challenge)

---

## Не блокирует SITE_COMPLETE

NBA по протоколу `audit-loop-protocol.md` — **готов на 96%**.  
`SITE_COMPLETE.md` — только когда все три вида ≥ 95% или явное исключение в протоколе.
