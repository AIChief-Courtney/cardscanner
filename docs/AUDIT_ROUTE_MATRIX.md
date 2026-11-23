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

## Next routes (audit queued)

Home, `/video-converter`, `/pdf-converter`, `/pdf-to-word`, compressors, PDF organize/trim, pricing, sign-in, account shells, API landings.

Mark **external** for ImageResizer/ProPDF slugs. Mark **unverified** until browser pass completed.