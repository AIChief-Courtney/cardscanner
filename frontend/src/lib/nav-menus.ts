import { getNavColumns, type NavColumn, type NavMenuKey } from "@/lib/nav-catalog";

export type ProductNavMenu = NavMenuKey;

export const PRODUCT_NAV_MENUS: { id: ProductNavMenu; label: string }[] = [
  { id: "convert", label: "Convert" },
  { id: "compress", label: "Compress" },
  { id: "tools", label: "Tools" },
  { id: "api", label: "API" },
];

export const NAV_MENU_LABELS: Record<ProductNavMenu, string> = {
  convert: "Convert",
  compress: "Compress",
  tools: "Tools",
  api: "API",
};

export function categoriesForNavMenu(menu: ProductNavMenu): NavColumn[] {
  return getNavColumns(menu);
}