# Perfect Season — Cursor + 9router

Локальный роутер: `http://127.0.0.1:20128/v1` (модели `cu/*` = Cursor Pro Plus).

## Модели по задачам

| Задача | Модель |
|--------|--------|
| UI, типы, мелкий fix | `cu/claude-4.5-haiku` |
| Refactor, новые компоненты | `cu/claude-4.5-sonnet` |
| Sim / 82-0 parity / draft logic | `cu/claude-4.5-sonnet-thinking` |

Правила parity: `.cursor/rules/82-0-parity.mdc`, `.cursor/rules/38-0-parity.mdc`.

## Команды

```bash
npm run dev
npm run validate:82-0-parity
npm run test:smoke
```
