# Customer frontend verification

Date: 2026-03-26 (session continuation)

## Commands

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` (frontend) | Pass |
| `npm run build` | Pass (142 static tool paths + dynamic hubs) |

## Route smoke (HTTP)

Run dev at http://localhost:3000 then spot-check:

- `/` — hero + `HomeWorkspace` (image converter queue)
- `/image-converter`, `/pdf-to-word`, `/merge-pdf`, `/split-pdf`, `/protect-pdf` — tool shells
- `/convert`, `/compress`, `/tools`, `/pricing`, `/faq` — directories / support
- Unknown slug → 404 via `[slug]`

## Visual QA (manual)

Breakpoints to review: **390px**, **768px**, **1440px**. Focus: `user-landing` overflow, queue rows (`tool-queue-row--responsive`), PDF merge list wrap, format chips vs select on mobile.

No automated visual regression runner in repo; capture screenshots under `docs/screenshots/` when doing before/after for changed pages.

## Status legend

| Status | Meaning |
|--------|---------|
| verified | Renders, links work, controls match intended demo behavior |
| demo | Labeled demo / sample output; no live backend codec |
| external | Outbound partner URL |
| integrated | Auth or profile wired |
| blocked | Requires server/integration not in scope |
| pending | Not individually exercised this pass |

## Blocked (global)

- Live Stripe checkout, cloud file pickers (Dropbox/Drive/OneDrive), HEIC/RAW server transcode, ProPDF/ImageResizer embeds
- Full pixel parity with FreeConvert (reference for routes/workflows only)

## Evidence this pass

- Production build completed after homepage workspace + PDF tool UIs + pair slug output hints
- TypeScript clean after `registry-data` `pairHints` expansion