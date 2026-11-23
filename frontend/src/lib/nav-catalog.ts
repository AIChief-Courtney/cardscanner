import type { ToolKind, UserTool } from "@/lib/user-tools";
import type { NavMenuKey } from "@/lib/nav-types";
import { NAV_TOOL_SLUGS, getToolRecord, recordToUserTool } from "@/lib/tools/registry";

export type { NavMenuKey };

export type NavColumn = {
  id: string;
  title: string;
  tools: UserTool[];
};

function buildMegaCatalog(): Record<NavMenuKey, NavColumn[]> {
  return (Object.keys(NAV_TOOL_SLUGS) as NavMenuKey[]).reduce(
    (acc, menu) => {
      acc[menu] = NAV_TOOL_SLUGS[menu].map((col) => ({
        id: col.id,
        title: col.title,
        tools: col.slugs
          .map((slug) => {
            const rec = getToolRecord(slug);
            return rec ? recordToUserTool(rec) : null;
          })
          .filter((t): t is UserTool => t !== null),
      }));
      return acc;
    },
    {} as Record<NavMenuKey, NavColumn[]>,
  );
}

/** Mega menus generated from the typed tool registry. */
export const NAV_MEGA_CATALOG: Record<NavMenuKey, NavColumn[]> = buildMegaCatalog();

export function getNavColumns(menu: NavMenuKey): NavColumn[] {
  return NAV_MEGA_CATALOG[menu];
}

export function allUniqueCatalogTools(): { tool: UserTool; columnId: string; columnTitle: string }[] {
  const seen = new Set<string>();
  const out: { tool: UserTool; columnId: string; columnTitle: string }[] = [];
  for (const columns of Object.values(NAV_MEGA_CATALOG)) {
    for (const col of columns) {
      for (const tool of col.tools) {
        if (seen.has(tool.slug)) continue;
        seen.add(tool.slug);
        out.push({ tool, columnId: col.id, columnTitle: col.title });
      }
    }
  }
  return out;
}

export function isUtilityKind(kind: ToolKind): boolean {
  return kind === "utility";
}