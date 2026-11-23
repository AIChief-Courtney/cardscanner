# Route audit matrix (in progress)

Columns: Reference URL | Local URL | Page type | Status | Notes

## Image converter (verified)

| Reference | Local | Type | Status | Notes |
|-----------|-------|------|--------|-------|
| /image-converter | /image-converter | category | **verified** | See AUDIT_IMAGE_CONVERTER.md |

## Shared template (applies to all category landings)

| Control | Status |
|---------|--------|
| Source tabs | OK (integrations labeled) |
| Output format picker | OK when `outputFormats` in registry |
| Queue + batch | OK |
| Advanced settings | OK (image quality) |
| Related tools | OK when `relatedToolsFor` entry exists |

## Category landings (template verified via registry)

| Local | Status | Notes |
|-------|--------|-------|
| /video-converter | smoke | outputFormats + shared workspace |
| /audio-converter | smoke | outputFormats + demo |
| /image-converter | **verified** | browser-local export |
| /pdf-converter | smoke | outputFormats + demo |
| /document-converter | smoke | related tools added |

## Platform / blocked

| Item | Status |
|------|--------|
| `@auth.js` vendor chunk on LAN dev | **fixed** — clear `.next`, `serverExternalPackages`, restart dev |
| HEIC / RAW / server codecs | blocked — demo message |
| Cloud pickers | blocked — labeled |
| ImageResizer / ProPDF slugs | external links |

## Next routes (audit queued)

Format pairs, compressors, PDF tools (merge/split/organize), calculators, pricing/checkout, sign-in, account shells, API landings, homepage.