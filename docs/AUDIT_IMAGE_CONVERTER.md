# `/image-converter` reference audit

| Reference | Local |
|-----------|-------|
| https://www.freeconvert.com/image-converter | http://localhost:3000/image-converter |

## Discrepancies (before → after)

| Area | Reference | Was | Fix |
|------|-----------|-----|-----|
| Hero | Title + “Convert images online, for free.” | Generic convert tagline | Registry tagline + breadcrumb |
| Output format | “Convert to” visible before upload | Hidden until `outputFormats` set | `OutputFormatPicker` (chips desktop, select mobile) |
| Queue | Thumbnails, per-file output, remove, add more | Basic queue | Previews, format column, responsive rows |
| Settings | Quality + batch vs per-file | Partial | Image quality slider; per-file output selects |
| Terms | Near upload | Missing | Terms of Use line |
| Related | Popular image tools | Missing | Related tools section |
| Below fold | Steps, features, FAQ | Steps only | Features + FAQ sections |
| Conversion | Server pipeline | Demo only | Browser-local JPG/PNG/WEBP/GIF for raster images |
| Downloads | Real files | Disabled buttons | Working download links for browser-local results |

## Remaining gaps (blocked)

- HEIC/RAW/TIFF/PDF/ICO outputs need server codecs (demo message shown).
- Cloud sources (Dropbox, Drive, OneDrive) and URL fetch need integrations.
- FC format grid lists 150+ niche formats — FileDock exposes practical subset + pair pages.

## Verification

- `npm run typecheck`, `npm run build`
- Manual: single PNG + batch JPG → PNG with downloads
- Screenshots: `image-converter-fc-1440.png` (reference); capture local after deploy