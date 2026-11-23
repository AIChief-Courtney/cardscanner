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

/** FileDock Next.js API routes only — all other `/api/*` is proxied to FC (uploads/jobs). */
const FILEDOCK_API_PREFIXES = ["/api/auth", "/api/admin", "/api/profile", "/api/register"];

/** Local slugs that alias to a different FC tool path. */
const FC_PATH_ALIASES: Record<string, string> = {
  "/pdf-convert": "/pdf-converter",
};

const SKIP_EXACT = new Set(["/robots.txt", "/favicon.ico"]);

/** Customer URLs that must use full FC HTML (never FileDock [slug] UI). */
export const FC_PROXY_TOOL_PATHS = new Set(["/pdf-converter", "/pdf-convert"]);

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
  const aliased = FC_PATH_ALIASES[pathname] ?? pathname;
  if (aliased === "/") return "/fc";
  return `/fc${aliased}`;
}