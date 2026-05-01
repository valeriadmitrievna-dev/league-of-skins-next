import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken } from "./lib/auth";
import { createProxy } from "next-i18next/proxy";
import i18nConfig from "./i18n.config";

const i18nProxy = createProxy(i18nConfig);

const PROTECTED_ROUTES = ["/collection", "/wishlists"];
const AUTH_ROUTES = ["/auth/signin", "/auth/signup"];

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
      return response;
    }

    if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
      const response = NextResponse.redirect(new URL("/auth/signin", request.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  const isAuth = isAccessValid;

  if (isAuth && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuth && PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return null;
};

export const proxy = async (request: NextRequest) => {
  const authResponse = await authProxy(request);
  if (authResponse) return authResponse;

  const i18nResponse = await i18nProxy(request);
  if (i18nResponse) return i18nResponse;

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)"],
};

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
// };
