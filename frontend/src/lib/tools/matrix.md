# Route coverage matrix (generated from registry)

See `buildRouteMatrix()` in `registry.ts`. Status meanings:

- **demo** — first-party UI with `DemoConversionAdapter`
- **external** — labeled outbound link (ImageResizer / ProPDF)
- **local-only** — Card Scanner OCR tools without reference parity

Verification is performed via `npm run typecheck`, `npm run build`, and manual nav link checks.