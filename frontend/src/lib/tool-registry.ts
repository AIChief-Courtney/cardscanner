import { allUniqueCatalogTools, isUtilityKind } from "@/lib/nav-catalog";
import type { ToolKind, UserTool } from "@/lib/user-tools";

/** URL segment on cardscanner.co (and this app). */
const ROUTE_OVERRIDES: Record<string, string> = {
  "bank-statement": "bank-statement-converter",
};

export type ToolPageMeta = UserTool & {
  categoryId: string;
  categoryTitle: string;
  route: string;
  h1: string;
  tagline: string;
  fileSupported: string;
  accept: string;
  badges: string[];
  convertLabel: string;
  outputHint?: string;
};

function defaultH1(label: string, kind: ToolKind, slug: string): string {
  if (kind === "api") return label;
  if (slug.includes("compressor") || slug.startsWith("compress-")) return label;
  if (slug.startsWith("compress")) return label;
  if (kind === "ocr" || kind === "utility") return label;
  if (label.toLowerCase().includes(" to ")) return label;
  if (label.toLowerCase().includes("converter")) return label;
  return `${label} Converter`;
}

function defaultTagline(label: string, kind: ToolKind, slug: string): string {
  if (slug.startsWith("compress")) {
    const target = label.replace(/compress(or)?/i, "").trim() || "files";
    return `Compress ${target} online, for free.`;
  }
  if (kind === "utility") {
    return `${label} online, for free.`;
  }
  if (kind === "ocr") {
    return `${label} online, for free.`;
  }
  const plain = label.toLowerCase().includes(" to ") ? label : `${label} files`;
  return `Convert ${plain} online, for free.`;
}

function defaultFileSupported(kind: ToolKind, slug: string): string {
  if (slug.startsWith("compress-pdf")) return "PDF";
  if (slug.startsWith("compress")) return "JPG, PNG, JPEG, WEBP, GIF";
  if (slug.startsWith("vcf")) return "VCF";
  if (slug.startsWith("pdf-to") || slug === "text-to-pdf") return "PDF";
  if (slug === "word-to-pdf") return "DOC, DOCX";
  if (slug === "text-to-image") return "Text input";
  if (kind === "pdf" && slug.includes("to-pdf")) {
    return "JPG, PNG, JPEG, GIF, BMP, DOC, DOCX";
  }
  if (kind === "excel" && slug.includes("to-excel")) {
    return "JPG, PNG, JPEG, GIF, PDF";
  }
  if (kind === "word" && slug.includes("to-word")) {
    return "PNG, JPG, JPEG, GIF, JFIF, BMP, PDF";
  }
  if (kind === "ocr" || slug.includes("bank-statement")) {
    return "JPG, JPEG, PNG, BMP, GIF, WEBP, PDF";
  }
  if (kind === "video") return "MP4, MOV, AVI, WEBM, MKV";
  if (kind === "audio") return "MP3, WAV, OGG, M4A, FLAC";
  if (kind === "gif") return "GIF, MP4, WEBM, APNG, MOV, AVI";
  return "JPG, PNG, GIF, JFIF, HEIC, PDF";
}

function defaultAccept(fileSupported: string): string {
  if (fileSupported === "VCF") return ".vcf,text/vcard";
  if (fileSupported.startsWith("PDF") && !fileSupported.includes("JPG")) {
    return ".pdf,application/pdf";
  }
  if (fileSupported.startsWith("Text")) return "";
  return "image/*,.pdf,application/pdf,.vcf";
}

function defaultBadges(kind: ToolKind, slug: string): string[] {
  if (slug.startsWith("compress")) {
    return ["Smaller files", "Fast compression", "Secure upload", "Works in browser"];
  }
  if (kind === "utility") {
    return ["Easy to use", "Browser-based", "Secure upload", "Free to try"];
  }
  if (kind === "ocr") {
    return ["Safe & Secure", "Fast processing", "AI-powered OCR", "Batch processing"];
  }
  return ["Free to try", "No signup needed", "Works with photos", "Handwriting & print"];
}

function defaultActionLabel(slug: string, kind: ToolKind): string {
  if (slug === "merge-pdf") return "Merge PDF";
  if (slug.includes("compressor") || slug.startsWith("compress-")) return "Compress";
  if (kind === "api") return "Get API Key";
  if (isUtilityKind(kind)) return "Apply";
  return "Convert";
}

function enrichTool(tool: UserTool, categoryId: string, categoryTitle: string): ToolPageMeta {
  const route = ROUTE_OVERRIDES[tool.slug] ?? tool.slug;
  const fileSupported = defaultFileSupported(tool.kind, tool.slug);
  return {
    ...tool,
    categoryId,
    categoryTitle,
    route,
    h1: defaultH1(tool.label, tool.kind, tool.slug),
    tagline: defaultTagline(tool.label, tool.kind, tool.slug),
    fileSupported,
    accept: defaultAccept(fileSupported),
    badges: defaultBadges(tool.kind, tool.slug),
    convertLabel: defaultActionLabel(tool.slug, tool.kind),
    outputHint:
      tool.kind === "api"
        ? "REST API"
        : tool.kind === "ocr" || tool.slug.includes("excel") || tool.slug.includes("csv")
          ? "Excel / CSV"
          : tool.kind === "word"
            ? "Word (DOCX)"
            : tool.kind === "pdf"
              ? "PDF"
              : tool.kind === "image"
                ? "Image"
                : tool.kind === "video"
                  ? "Video"
                  : tool.kind === "audio"
                    ? "Audio"
                    : tool.kind === "gif"
                      ? "GIF"
                      : "Plain text (TXT)",
  };
}

const ALL_TOOLS: ToolPageMeta[] = allUniqueCatalogTools().map(({ tool, columnId, columnTitle }) =>
  enrichTool(tool, columnId, columnTitle),
);

const BY_ROUTE = new Map(ALL_TOOLS.map((t) => [t.route, t]));
const BY_SLUG = new Map(ALL_TOOLS.map((t) => [t.slug, t]));

export function allToolRoutes(): string[] {
  return ALL_TOOLS.map((t) => t.route);
}

export function getToolByRoute(route: string): ToolPageMeta | undefined {
  const direct = BY_ROUTE.get(route);
  if (direct) return direct;
  for (const [slug, path] of Object.entries(ROUTE_OVERRIDES)) {
    if (path === route) return BY_SLUG.get(slug);
  }
  return undefined;
}

export function getToolBySlug(slug: string): ToolPageMeta | undefined {
  return BY_SLUG.get(slug);
}

export function toolPagePath(slug: string): string {
  const meta = getToolBySlug(slug);
  return `/${meta?.route ?? ROUTE_OVERRIDES[slug] ?? slug}`;
}

export function toolHref(slug: string): string {
  return toolPagePath(slug);
}