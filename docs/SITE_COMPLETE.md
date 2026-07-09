# Perfect Season Hub — status (honest)

**Updated:** 2026-07-08  
**Product version:** `v0.1.0` (footer) — **not** a public launch claim.

---

## Readiness (audit-backed, not marketing)

| Sport | Playable loop | Parity vs reference | Notes |
|-------|---------------|---------------------|--------|
| **NBA (82-0)** | Strong | Core sim ~high; product shell incomplete | Engine/gates/skips OK; photos sparse; Daily = local stub; PreDraft UX removed |
| **Football (38-0)** | Playable | Partial | Formations + difficulty; scale below 38-0.app |
| **Hockey** | Playable | Partial | Smaller pool; less polish |

**Verdict:** shippable as a **fan prototype / sandbox**, not as “≥99% complete” product.

---

## What is true today

- Basketball sim: era-adjusted totals, win curve, category gates, separate skip team/era, Classic / HoopIQ / Daily vs CPU
- Cards: PPG · RPG · APG · SPG · BPG only (no OVR)
- `npm run generate:data` + `assertNoDuplicates` (diacritic-normalized keys)
- `npm run validate:nba` / `validate:football` / parity scripts in CI

---

## Explicitly incomplete (do not claim done)

- Pre-draft playstyle / season-reveal UI — **removed**; sim defaults to `balanced`
- Player photo coverage (~dozens vs full roster)
- Real Daily leaderboard (current: `localStorage` stub)
- Docs that previously claimed ≥99% / SITE COMPLETE — **superseded by this file**

---

## Manual QA (smoke)

| Flow | Expect |
|------|--------|
| Basketball classic → spin → pick | No PreDraft panel |
| HoopIQ | Stats hidden |
| Daily | One local attempt; vs CPU |
| Football formations + difficulty | Works |
| Hockey draft | No crash |

---

## Key artifacts

- `.cursor/rules/82-0-parity.mdc`
- `scripts/validate-nba-stats.mjs`, `scripts/generate-data.ts`
- Audit: critical review 2026-07-08 (~55/100 launch readiness)
