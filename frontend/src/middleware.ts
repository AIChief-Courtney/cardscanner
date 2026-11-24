import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Legacy URLs from the old account hub → dashboard. */
const LEGACY_USER_HUB = ["/profile", "/account"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (LEGACY_USER_HUB.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};