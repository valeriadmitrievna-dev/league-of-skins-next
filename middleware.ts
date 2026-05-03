import { NextResponse, type NextRequest } from "next/server";
import { createProxy } from "next-i18next/proxy";

import i18nConfig from "./i18n.config";
import { verifyAccessToken, verifyRefreshToken, signAccessToken } from "./lib/auth";
import { ACCESS_COOKIE, serializeCookie } from "./lib/cookies";

const i18nProxy = createProxy(i18nConfig);

const PROTECTED_ROUTES = ["/collection", "/wishlists"];
const AUTH_ROUTES = ["/auth/signin", "/auth/signup"];

const withPathname = (request: NextRequest, response: NextResponse) => {
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
};

const tryRefreshToken = async (request: NextRequest): Promise<{ newAccessToken: string } | null> => {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (!refreshToken) return null;

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  const res = await fetch(
    `${supabaseUrl}/rest/v1/refresh_tokens?token=eq.${encodeURIComponent(refreshToken)}&select=id`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      signal: AbortSignal.timeout(3000),
    },
  );

  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.length) return null;

  const newAccessToken = signAccessToken(payload.userId);
  return { newAccessToken };
};

const authProxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAccessValid = accessToken && !!verifyAccessToken(accessToken);

  if (!isAccessValid && refreshToken) {
    const refreshResult = await tryRefreshToken(request);

    if (refreshResult) {
      const response = NextResponse.redirect(request.url);
      response.headers.append(
        "Set-Cookie",
        serializeCookie("accessToken", refreshResult.newAccessToken, ACCESS_COOKIE),
      );
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

export const middleware = async (request: NextRequest) => {
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