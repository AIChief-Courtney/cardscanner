/** Paths served by FileDock (not proxied to freeconvert.com). */
const SKIP_PREFIXES = [
  "/_next",
  "/account",
  "/admin",
  "/signin",
  "/signup",
  "/dashboard",
  "/profile",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
  "/security",
  "/fc",
  "/fixtures",
];

/** FC has no directory pages for these — mega menus live on `/`. */
export const FC_HEADER_REDIRECTS = new Set(["/convert", "/compress", "/tools"]);

const SKIP_EXACT = new Set(["/robots.txt", "/favicon.ico"]);

export function shouldServeLocalApp(pathname: string): boolean {
  if (SKIP_EXACT.has(pathname)) return true;
  if (pathname.startsWith("/api/")) return true;
  if (SKIP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return true;
  if (/\.(png|jpe?g|svg|gif|webp|ico|txt|json|map)$/i.test(pathname)) return true;
  return false;
}

export function fcProxyRewritePath(pathname: string): string {
  if (pathname === "/") return "/fc";
  return `/fc${pathname}`;
}