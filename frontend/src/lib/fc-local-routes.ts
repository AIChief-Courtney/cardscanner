/** Paths served by FileDock (not proxied to freeconvert.com). */
const SKIP_PREFIXES = [
  "/_next",
  "/api",
  "/account",
  "/admin",
  "/signin",
  "/signup",
  "/dashboard",
  "/profile",
  "/convert",
  "/compress",
  "/tools",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
  "/security",
  "/fc",
  "/fixtures",
];

const SKIP_EXACT = new Set(["/robots.txt", "/favicon.ico"]);

export function shouldServeLocalApp(pathname: string): boolean {
  if (SKIP_EXACT.has(pathname)) return true;
  if (SKIP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return true;
  if (/\.(png|jpe?g|svg|gif|webp|ico|txt|json|map)$/i.test(pathname)) return true;
  return false;
}

export function fcProxyRewritePath(pathname: string): string {
  if (pathname === "/") return "/fc";
  return `/fc${pathname}`;
}