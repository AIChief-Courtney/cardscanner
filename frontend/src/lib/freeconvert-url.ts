import type { ToolKind } from "@/lib/user-tools";

export const FREECONVERT_ORIGIN = "https://www.freeconvert.com";

/** Card Scanner–only tools (no FreeConvert page). */
const LOCAL_ONLY_SLUGS = new Set(["bank-statement"]);

/** Catalog slug → freeconvert.com path (URL segment). */
export const FC_ROUTE_BY_SLUG: Record<string, string> = {
  "trim-video": "video-trimmer",
  "compress-jpg": "compress-jpeg",
  "compress-image": "image-compressor",
  "protect-pdf": "password-protect-pdf",
  "extract-pages-pdf": "extract-pages-from-pdf",
  "extract-pages-from-pdf": "extract-pages-from-pdf",
  "extract-images-pdf": "extract-images-from-pdf",
  "extract-image-from-pdf": "extract-images-from-pdf",
  "e-sign": "pdf-converter",
  "edit-pdf": "pdf-converter",
  "annotate-pdf": "pdf-converter",
  "create-fillable-pdf": "pdf-converter",
  "pdf-reader": "pdf-converter",
  "sign-pdf": "pdf-converter",
  "api-documentation": "api",
  "api-job-builder": "api/job-builder",
  "compress-jpeg": "compress-jpeg",
  "mp3-compressor": "mp3-compressor",
  "wav-compressor": "wav-compressor",
  "video-compressor": "video-compressor",
  "image-compressor": "image-compressor",
  "gif-compressor": "gif-compressor",
  "gif-maker": "gif-maker",
  "crop-image": "image-converter",
  "rotate-image": "image-converter",
  "flip-image": "image-converter",
  "image-enlarger": "image-converter",
  "color-picker": "image-converter",
  "resize-image": "image-converter",
  "merge-pdf": "merge-pdf",
  "split-pdf": "split-pdf",
  "flatten-pdf": "flatten-pdf",
  "resize-pdf": "resize-pdf",
  "unlock-pdf": "unlock-pdf",
  "rotate-pdf": "rotate-pdf",
  "organize-pdf": "organize-pdf",
  "crop-pdf": "crop-pdf",
  "pdf-page-remover": "pdf-page-remover",
};

const API_DOC_FALLBACK = "api";

const API_SLUG_TO_PATH: Record<string, string> = {
  "file-conversion-api": "api",
  "image-conversion-api": "api",
  "audio-conversion-api": "api",
  "document-conversion-api": "api",
  "pdf-conversion-api": "api",
  "mp4-conversion-api": "api",
  "video-conversion-api": "api",
  "jpg-to-pdf-api": "jpg-to-pdf",
  "video-to-mp3-api": "video-to-mp3",
  "heic-to-jpg-api": "heic-to-jpg",
  "pdf-to-jpg-api": "pdf-to-jpg",
  "webp-to-png-api": "webp-to-png",
  "pdf-to-word-api": "pdf-to-word",
  "mp4-to-mp3-api": "mp4-to-mp3",
  "webp-to-jpg-api": "webp-to-jpg",
  "word-to-pdf-api": "word-to-pdf",
  "html-to-pdf-api": "html-to-pdf",
  "website-screenshot-api": "api",
  "video-compression-api": "video-compressor",
  "compress-pdf-api": "compress-pdf",
  "image-compression-api": "image-compressor",
};

function fallbackPath(slug: string, kind: ToolKind): string {
  if (slug.endsWith("-api")) return API_SLUG_TO_PATH[slug] ?? API_DOC_FALLBACK;
  if (kind === "api") return API_SLUG_TO_PATH[slug] ?? API_DOC_FALLBACK;
  if (slug.startsWith("compress")) {
    return slug.includes("pdf") ? "compress-pdf" : "image-compressor";
  }
  if (kind === "video" || kind === "audio" || kind === "gif") return slug;
  if (kind === "utility" && slug.includes("pdf")) return slug;
  if (kind === "utility") return "image-converter";
  if (kind === "ocr") return "image-to-text";
  return slug;
}

export function freeConvertPath(slug: string, kind: ToolKind): string | null {
  if (LOCAL_ONLY_SLUGS.has(slug)) return null;
  return FC_ROUTE_BY_SLUG[slug] ?? fallbackPath(slug, kind);
}

export function freeConvertUrl(slug: string, kind: ToolKind): string | null {
  const path = freeConvertPath(slug, kind);
  if (!path) return null;
  return `${FREECONVERT_ORIGIN}/${path}`;
}

export function isFreeConvertHref(href: string): boolean {
  return href.startsWith(FREECONVERT_ORIGIN);
}