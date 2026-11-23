import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fcProxyRewritePath, shouldServeLocalApp } from "@/lib/fc-local-routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/pdf-convert") {
    return NextResponse.redirect(new URL("/pdf-converter", request.url));
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