import type { NavMenuKey } from "@/lib/nav-types";
import type { UserTool } from "@/lib/user-tools";
import { REFERENCE_ORIGIN, TOOL_DEFINITIONS } from "@/lib/tools/registry-data";
import type { ToolRecord } from "@/lib/tools/types";

const BY_SLUG = new Map(TOOL_DEFINITIONS.map((t) => [t.slug, t]));
const BY_ROUTE = new Map(TOOL_DEFINITIONS.map((t) => [t.route, t]));

export const NAV_TOOL_SLUGS: Record<NavMenuKey, { id: string; title: string; slugs: string[] }[]> = {
  convert: [
    {
      id: "video-audio",
      title: "Video & Audio",
      slugs: ["video-converter", "audio-converter", "mp3-converter", "mp4-to-mp3", "video-to-mp3", "mp4-converter", "mov-to-mp4", "mp3-to-ogg"],
    },
    {
      id: "image",
      title: "Image",
      slugs: ["image-converter", "webp-to-png", "jfif-to-png", "png-to-svg", "heic-to-jpg", "heic-to-png", "webp-to-jpg", "svg-converter"],
    },
    {
      id: "pdf",
      title: "PDF & Documents",
      slugs: ["pdf-converter", "document-converter", "ebook-converter", "pdf-to-word", "pdf-to-jpg", "pdf-to-epub", "epub-to-pdf", "heic-to-pdf", "docx-to-pdf", "jpg-to-pdf"],
    },
    {
      id: "gif",
      title: "GIF",
      slugs: ["video-to-gif", "mp4-to-gif", "webm-to-gif", "apng-to-gif", "gif-to-mp4", "gif-to-apng", "image-to-gif", "mov-to-gif", "avi-to-gif"],
    },
    {
      id: "other",
      title: "Others",
      slugs: ["unit-converter", "time-converter", "archive-converter", "rar-to-zip", "lbs-to-kg", "kg-to-lbs", "feet-to-meters", "pst-to-est", "cst-to-est"],
    },
  ],
  compress: [
    { id: "video-audio", title: "Video & Audio", slugs: ["video-compressor", "mp3-compressor", "wav-compressor"] },
    { id: "image", title: "Image", slugs: ["image-compressor", "compress-jpeg", "compress-png"] },
    { id: "pdf", title: "PDF & Documents", slugs: ["compress-pdf"] },
    { id: "gif", title: "GIF", slugs: ["gif-compressor"] },
  ],
  tools: [
    { id: "video-gif", title: "Video & GIF", slugs: ["crop-video", "trim-video", "gif-maker"] },
    {
      id: "image",
      title: "Image",
      slugs: ["resize-image", "crop-image", "color-picker", "rotate-image", "flip-image", "image-enlarger"],
    },
    {
      id: "pdf",
      title: "PDF & Documents",
      slugs: [
        "edit-pdf",
        "annotate-pdf",
        "e-sign",
        "create-fillable-pdf",
        "pdf-reader",
        "merge-pdf",
        "split-pdf",
        "flatten-pdf",
        "resize-pdf",
        "unlock-pdf",
        "rotate-pdf",
        "protect-pdf",
        "crop-pdf",
        "organize-pdf",
        "extract-image-from-pdf",
        "pdf-page-remover",
        "extract-pages-from-pdf",
        "bank-statement",
      ],
    },
  ],
  api: [
    { id: "api-start", title: "Get started", slugs: ["api-job-builder", "api-documentation"] },
    {
      id: "api-convert",
      title: "Conversion APIs",
      slugs: [
        "file-conversion-api",
        "image-conversion-api",
        "audio-conversion-api",
        "document-conversion-api",
        "pdf-conversion-api",
        "mp4-conversion-api",
        "video-conversion-api",
      ],
    },
    {
      id: "api-popular",
      title: "Popular APIs",
      slugs: [
        "jpg-to-pdf-api",
        "video-to-mp3-api",
        "heic-to-jpg-api",
        "pdf-to-jpg-api",
        "webp-to-png-api",
        "pdf-to-word-api",
        "mp4-to-mp3-api",
        "webp-to-jpg-api",
        "word-to-pdf-api",
        "html-to-pdf-api",
        "website-screenshot-api",
      ],
    },
    {
      id: "api-compress",
      title: "Compression APIs",
      slugs: ["video-compression-api", "compress-pdf-api", "image-compression-api"],
    },
  ],
};

export function getToolRecord(slug: string): ToolRecord | undefined {
  return BY_SLUG.get(slug);
}

export function getToolByRoute(route: string): ToolRecord | undefined {
  return BY_ROUTE.get(route) ?? BY_SLUG.get(route);
}

export function allToolRecords(): ToolRecord[] {
  return TOOL_DEFINITIONS;
}

export function allToolRoutes(): string[] {
  return TOOL_DEFINITIONS.map((t) => t.route);
}

export function recordToUserTool(t: ToolRecord): UserTool {
  return { slug: t.slug, label: t.label, kind: t.kind };
}

export function searchTools(query: string): ToolRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return TOOL_DEFINITIONS.filter(
    (t) =>
      t.label.toLowerCase().includes(q) ||
      t.slug.includes(q) ||
      t.keywords.some((k) => k.includes(q)) ||
      (t.aliases?.some((a) => a.includes(q)) ?? false),
  ).slice(0, 12);
}

export type RouteMatrixRow = {
  referenceUrl: string;
  localUrl: string;
  menuGroup: string;
  template: string;
  firstParty: boolean;
  execution: string;
  status: "verified" | "demo" | "external" | "local-only";
};

export function buildRouteMatrix(): RouteMatrixRow[] {
  return TOOL_DEFINITIONS.map((t) => ({
    referenceUrl: `${REFERENCE_ORIGIN}/${t.referencePath}`,
    localUrl: `/${t.route}`,
    menuGroup: t.menuGroup,
    template: t.template,
    firstParty: !t.externalUrl,
    execution: t.execution,
    status: t.externalUrl ? "external" : t.slug === "bank-statement" ? "local-only" : "demo",
  }));
}

export function toolHref(slug: string): string {
  const t = getToolRecord(slug);
  return `/${t?.route ?? slug}`;
}