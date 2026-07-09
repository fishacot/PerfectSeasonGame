# Fix prompt — итерация 6 (v2 parity)

**Контекст:** Итерация 5 закрыла все P0 bugs. NBA 98%, Football 96%, Hockey 97%.

---

## Приоритет 1 — Result screen (82-0 parity)

1. Добавить `grade: string` (A+…F) в `SimulationResult` — map avg category score в basketball adapter.
2. `bestPickId` / `weakestCategory` уже частично в breakdown — показать в `ResultBreakdown`.
3. i18n en/ru для grade labels и tier names.

**Файлы:** `src/lib/simulation/adapters/basketball.ts`, `ResultBreakdown.tsx`, `dictionaries.ts`

---

## Приоритет 2 — Football formation picker (38-0.app stretch)

1. `src/lib/config/formations.ts` — 3 формации: 4-3-3 (default), 4-4-2, 3-5-2.
2. Store `formationId` in draft state; derive positions from formation.
3. Picker on mode-select or pre-draft screen.

**ponytail:** start with 3, not 12.

---

## Приоритет 3 — How to Play page

1. `/[locale]/how-to-play` — mirror 82-0/38-0 guides (spin → pick → place → simulate).
2. Link from hub and mode-select.

---

## Приоритет 4 — NBA era-repeat (product decision)

82-0 classic **allows** decade repeats; we require 5 distinct eras.  
**Decision needed:** align with 82-0 (`maxPerEra: 2` or unlimited) OR document as intentional stricter rule.

---

## Regression checklist (every iteration)

```bash
npm run generate:data && npm run build
npx tsx src/lib/game/challenge.ts
npx tsx src/lib/simulation/engine.ts
```

- [ ] 0 duplicate playerKey in all JSON
- [ ] Daily button disabled after attempt
- [ ] `?challenge=` loads fixed spins
- [ ] `/api/simulate` returns 400 on invalid era roster
- [ ] Hockey unchanged
