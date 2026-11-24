/** FileDock Next.js API routes only — other `/api/*` is proxied to FC when dashboard loads. */
const FILEDOCK_API_PREFIXES = ["/api/auth", "/api/admin", "/api/profile", "/api/register"];

const LOCAL_PREFIXES = [
  "/_next",
  "/admin",
  "/signin",
  "/signup",
  "/fc",
  "/favicon",
  "/robots",
];

const SKIP_EXACT = new Set(["/robots.txt", "/favicon.ico"]);

function isFiledockApi(pathname: string): boolean {
  return FILEDOCK_API_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function shouldServeLocalApp(pathname: string): boolean {
  if (SKIP_EXACT.has(pathname)) return true;
  if (pathname === "/") return true;
  if (pathname.startsWith("/api") && isFiledockApi(pathname)) return true;
  if (LOCAL_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return true;
  if (/\.(png|jpe?g|svg|gif|webp|ico|txt|json|map)$/i.test(pathname)) return true;
  return false;
}

export function dashboardToFcPath(pathname: string): string | null {
  if (pathname === "/dashboard") return "account/tasks";
  if (pathname.startsWith("/dashboard/")) {
    const rest = pathname.slice("/dashboard/".length);
    return rest ? `account/${rest}` : "account/tasks";
  }
  return null;
}