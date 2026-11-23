import type { ToolTemplate, ExecutionMode } from "@/lib/tools/types";
import {
  allToolRecords,
  getToolRecord,
  toolHref as registryToolHref,
} from "@/lib/tools/registry";
import { allUniqueCatalogTools, isUtilityKind } from "@/lib/nav-catalog";
import type { ToolKind, UserTool } from "@/lib/user-tools";

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
  template: ToolTemplate;
  execution: ExecutionMode;
  externalUrl?: string;
  outputFormats?: string[];
  defaultOutput?: string;
  maxFiles: number;
  maxSizeMb: number;
};

function defaultBadges(kind: ToolKind, slug: string, template: ToolTemplate): string[] {
  if (template === "compressor") {
    return ["Smaller files", "Demo compression", "Secure in-browser queue", "No upload in demo"];
  }
  if (template === "api-landing") {
    return ["REST shape", "Sample JSON", "Copy helpers", "Not a live API"];
  }
  if (kind === "ocr" || slug.includes("bank-statement")) {
    return ["Safe & Secure", "Demo OCR", "Batch queue", "Sign in for history"];
  }
  return ["Free to try", "Demo mode", "Works in browser", "Sample outputs labeled"];
}

function findCatalogColumn(slug: string): { columnId: string; columnTitle: string } {
  for (const { tool, columnId, columnTitle } of allUniqueCatalogTools()) {
    if (tool.slug === slug) return { columnId, columnTitle };
  }
  return { columnId: "other", columnTitle: "Tools" };
}

export function recordToPageMeta(slug: string): ToolPageMeta | undefined {
  const rec = getToolRecord(slug);
  if (!rec) return undefined;
  const { columnId, columnTitle } = findCatalogColumn(slug);
  const outputHint =
    rec.defaultOutput ?? rec.outputFormats?.[0] ?? (rec.kind === "api" ? "REST API" : "output");
  return {
    slug: rec.slug,
    label: rec.label,
    kind: rec.kind,
    categoryId: columnId,
    categoryTitle: columnTitle,
    route: rec.route,
    h1: rec.h1,
    tagline: rec.tagline,
    fileSupported: rec.inputHints,
    accept: rec.accept,
    badges: defaultBadges(rec.kind, rec.slug, rec.template),
    convertLabel: rec.convertLabel,
    outputHint,
    template: rec.template,
    execution: rec.execution,
    externalUrl: rec.externalUrl,
    outputFormats: rec.outputFormats,
    defaultOutput: rec.defaultOutput,
    maxFiles: rec.maxFiles,
    maxSizeMb: rec.maxSizeMb,
  };
}

const ALL_TOOLS: ToolPageMeta[] = allToolRecords()
  .map((r) => recordToPageMeta(r.slug))
  .filter((t): t is ToolPageMeta => !!t);

const BY_ROUTE = new Map(ALL_TOOLS.map((t) => [t.route, t]));
const BY_SLUG = new Map(ALL_TOOLS.map((t) => [t.slug, t]));

export function allToolRoutes(): string[] {
  return ALL_TOOLS.map((t) => t.route);
}

export function getToolByRoute(route: string): ToolPageMeta | undefined {
  return BY_ROUTE.get(route) ?? BY_SLUG.get(route);
}

export function getToolBySlug(slug: string): ToolPageMeta | undefined {
  return BY_SLUG.get(slug);
}

export function toolPagePath(slug: string): string {
  return registryToolHref(slug);
}

export function toolHref(slug: string): string {
  return toolPagePath(slug);
}

export { isUtilityKind };