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
  "/pdf-convert",
  "/pdf-converter",
];

/** FC has no directory pages for these — mega menus live on `/`. */
export const FC_HEADER_REDIRECTS = new Set(["/convert", "/compress", "/tools"]);

/** FileDock Next.js API routes only — all other `/api/*` is proxied to FC (uploads/jobs). */
const FILEDOCK_API_PREFIXES = ["/api/auth", "/api/admin", "/api/profile", "/api/register"];

const SKIP_EXACT = new Set(["/robots.txt", "/favicon.ico"]);

/** Reserved for future full-FC embed routes (pdf-convert uses local workspace + FC output UI). */
export const FC_PROXY_TOOL_PATHS = new Set<string>();

function isFiledockApi(pathname: string): boolean {
  return FILEDOCK_API_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function shouldServeLocalApp(pathname: string): boolean {
  if (SKIP_EXACT.has(pathname)) return true;
  if (pathname.startsWith("/api") && isFiledockApi(pathname)) return true;
  if (SKIP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return true;
  if (/\.(png|jpe?g|svg|gif|webp|ico|txt|json|map)$/i.test(pathname)) return true;
  return false;
}

export function fcProxyRewritePath(pathname: string): string {
  if (pathname === "/") return "/fc";
  return `/fc${pathname}`;
}