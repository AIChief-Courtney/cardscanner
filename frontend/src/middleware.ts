import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isAdmin } from "@backend/lib/roles";
import { dashboardToFcPath, shouldServeLocalApp } from "@/lib/fc-local-routes";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/account")) {
    const suffix = pathname.slice("/account".length) || "";
    return NextResponse.redirect(new URL(`/dashboard${suffix}`, request.url));
  }
  if (pathname === "/profile" || pathname.startsWith("/profile/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const fcDashboardPath = dashboardToFcPath(pathname);
  if (fcDashboardPath) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });
    if (!token?.sub) {
      const url = new URL("/signin", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (isAdmin(token.role)) {
      return NextResponse.redirect(new URL("/admin/overview", request.url));
    }
    return NextResponse.rewrite(new URL(`/fc/${fcDashboardPath}`, request.url));
  }

  if (pathname.startsWith("/api") && !shouldServeLocalApp(pathname)) {
    const apiPath = pathname.replace(/^\//, "");
    return NextResponse.rewrite(new URL(`/fc/${apiPath}`, request.url));
  }

  if (shouldServeLocalApp(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};