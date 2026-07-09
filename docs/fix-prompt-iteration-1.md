# Fix Prompt — Итерация 1 (для Subagent 2)

## P0 — NBA pool depth (6 игроков на club×era)

**Файлы:**
- `scripts/seeds/nba-core-boost.ts` (создать через `scripts/build-nba-boost.mjs`)
- `scripts/generate-data.ts` — merge `NBA_CORE_BOOST`, `validatePool(..., 6, ..., true)`

**Действие:** +2 реальных игрока на каждую комбинацию 15 core-франшиз (`nba.ts`) где было 4 игрока.

**Критерий приёмки:**
- `node -e` на `data/basketball/nba.json`: avg ≥ 6.0, thin (>0,<6) = 0
- Rockets 2010s содержит Harden, CP3 (+ Gordon, Capela)
- `npm run generate:data` без warn по существующим пулам

---

## P0 — MIN_POOL для спина

**Файл:** `src/lib/game/spin.ts`

**Действие:** `MIN_POOL = 6`

**Критерий:** спин не возвращает club×era с < 6 доступными игроками (кроме исчерпанного пула после пиков).

---

## P2 — i18n GameClient

**Файлы:** `src/lib/i18n/dictionaries.ts`, `src/components/game/GameClient.tsx`

**Действие:** вынести hardcoded EN строки в словарь (noPlayersFit, available, assignPosition, seasonComplete, subtitles).

**Критерий:** RU/EN переключаются без смешанных строк в play UI.

---

## После правок

```bash
npm run generate:data
npm run build
```
