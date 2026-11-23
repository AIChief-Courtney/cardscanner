# Route coverage matrix

Generated from `frontend/src/lib/tools/registry.ts` (`buildRouteMatrix()`). Reference site: [FreeConvert](https://www.freeconvert.com/) (feature coverage only).

| Status | Meaning |
|--------|---------|
| demo | First-party FileDock page + `DemoConversionAdapter` |
| external | Labeled outbound link (ImageResizer / ProPDF) |
| local-only | Bank statement OCR (no FC parity) |

## Verification (this branch)

- `npm run typecheck` (frontend)
- `npm run build` (frontend)
- Manual: header mega menus, search (Escape), `/pdf-to-word` queue → demo result → `/account/tasks`

Full row export: run a small script importing `buildRouteMatrix()` or inspect registry slugs (100+ tools).

## Integration summary

| Mode | Examples |
|------|----------|
| browser-local | Unit/time calculators |
| demo | Converters, compressors, most PDF/media tools |
| external | resize-image, edit-pdf, … |
| integrated | next-auth sign-in, existing `/profile` (not new auth) |
| unavailable | Live API, cloud pickers, payments |