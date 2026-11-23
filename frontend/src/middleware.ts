import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  FC_HEADER_REDIRECTS,
  FC_PROXY_TOOL_PATHS,
  fcProxyRewritePath,
  shouldServeLocalApp,
} from "@/lib/fc-local-routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (FC_PROXY_TOOL_PATHS.has(pathname)) {
    return NextResponse.rewrite(new URL(fcProxyRewritePath(pathname), request.url));
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