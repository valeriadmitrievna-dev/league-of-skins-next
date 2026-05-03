import { NextResponse, type NextRequest } from "next/server";
import { createProxy } from "next-i18next/proxy";

import i18nConfig from "./i18n.config";
import { verifyAccessToken } from "./lib/auth";

const i18nProxy = createProxy(i18nConfig);

const PROTECTED_ROUTES = ["/collection", "/wishlists"];
const AUTH_ROUTES = ["/auth/signin", "/auth/signup"];

const withPathname = (request: NextRequest, response: NextResponse) => {
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
};

const authProxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAccessValid = accessToken && !!verifyAccessToken(accessToken);

  if (!isAccessValid && refreshToken) {
    const refreshResponse = await fetch(new URL("/api/auth/refresh", request.url), {
      method: "POST",
      headers: { cookie: request.headers.get("cookie") ?? "" },
    });

    if (refreshResponse.ok) {
      const response = NextResponse.redirect(request.url);
      refreshResponse.headers.getSetCookie().forEach((cookie) => {
        response.headers.append("Set-Cookie", cookie);
      });
      return withPathname(request, response);
    }

    if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
      const response = NextResponse.redirect(new URL("/auth/signin", request.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return withPathname(request, response);
    }
  }

  const isAuth = isAccessValid;

  if (isAuth && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return withPathname(request, NextResponse.redirect(new URL("/", request.url)));
  }

  if (!isAuth && PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("redirect", pathname);
    return withPathname(request, NextResponse.redirect(url));
  }

  return null;
};

export const proxy = async (request: NextRequest) => {
  const authResponse = await authProxy(request);
  if (authResponse) return authResponse;

  const i18nResponse = await i18nProxy(request);
  if (i18nResponse) return withPathname(request, i18nResponse);

  return withPathname(
    request,
    NextResponse.next({
      request: {
        headers: new Headers({
          ...Object.fromEntries(request.headers),
          "x-pathname": request.nextUrl.pathname,
        }),
      },
    }),
  );
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)"],
};
