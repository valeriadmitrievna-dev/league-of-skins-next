import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken } from "./lib/auth";

const PROTECTED_ROUTES = ["/collection", "/wishlists"];
const AUTH_ROUTES = ["/auth/signin", "/auth/signup"];

export const proxy = async (request: NextRequest) => {
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

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
