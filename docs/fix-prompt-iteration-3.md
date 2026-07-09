# Fix Prompt — Итерация 3 (для следующего цикла)

## P1 — Футбол: довести до 95%

**Файлы:** `scripts/fb-epl-extra.json`, `scripts/fb-boost-part2.json`, `src/lib/config/leagues/football.ts`

**Действие:**
1. Расширить La Liga / Serie A / Bundesliga / Ligue 1 до **10+ клубов** каждая (сейчас 5–6)
2. Документировать formation stub: добавить `ponytail:` в `LineupBoard.tsx` — «fixed 4-3-3; 38-0 picker deferred»
3. Опционально: chemistry bonus за повтор клуба (как NBA)

**Критерий:** football ≥ 95%; EPL уже PASS (21 clubs, avg 6.00)

---

## P1 — Хоккей: 32 NHL teams

**Файлы:** `scripts/hk-extra.json`, `scripts/hk-boost.json`

**Действие:** добавить оставшиеся **12** franchises (Jets, Stars, Ducks, Kings, Canucks, Coyotes/Utah, Blue Jackets, Sabres, Predators, Hurricanes, Flyers, Kraken) с 6 игроками/era где команда существовала

**Критерий:** hockey ≥ 95%; avg 6.00 сохранить

---

## P2 — Полировка (не блокер SITE_COMPLETE)

- NBA Blind label → «HoopIQ»
- Letter grade в `ResultBreakdown`
- Football season spin (38-0 seasons) — v2 scope

---

## Не создавать SITE_COMPLETE

NBA 96%, Football 88%, Hockey 90% — все < 95% или mechanics gap (formation picker).
