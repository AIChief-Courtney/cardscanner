import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FC_HEADER_REDIRECTS, fcProxyRewritePath, shouldServeLocalApp } from "@/lib/fc-local-routes";

const USER_HUB_REDIRECTS = ["/profile", "/account"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    USER_HUB_REDIRECTS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (FC_HEADER_REDIRECTS.has(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (shouldServeLocalApp(pathname)) {
    return NextResponse.next();
  }

  const target = fcProxyRewritePath(pathname);
  return NextResponse.rewrite(new URL(target, request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};