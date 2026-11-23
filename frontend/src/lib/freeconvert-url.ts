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
  "resize-image": "image-converter",
  "edit-pdf": "pdf-converter",
  "annotate-pdf": "pdf-converter",
  "create-fillable-pdf": "pdf-converter",
  "pdf-reader": "pdf-converter",
  "sign-pdf": "pdf-converter",
  "api-documentation": "api",
  "api-job-builder": "api/job-builder",
};

const API_DOC_FALLBACK = "api";

function fallbackPath(slug: string, kind: ToolKind): string {
  if (slug.endsWith("-api")) return API_DOC_FALLBACK;
  if (kind === "api") return API_DOC_FALLBACK;
  if (slug.startsWith("compress")) {
    return slug.includes("pdf") ? "compress-pdf" : "image-compressor";
  }
  if (kind === "video" || kind === "audio" || kind === "gif") return slug;
  if (kind === "utility" && slug.includes("pdf")) return slug;
  if (kind === "utility") return slug;
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