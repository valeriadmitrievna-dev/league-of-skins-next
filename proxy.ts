import { NextResponse, type NextRequest } from "next/server";

import { verifyAccessToken } from './lib/auth';
import { isUUID } from './shared/utils/isUUID';

const PROTECTED_ROUTES = ["/collection", "/wishlists"];
const AUTH_ROUTES = ["/auth/signin", "/auth/signup"];

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const isAuth = !!verifyAccessToken(accessToken ?? "");

  const isProtected = PROTECTED_ROUTES.some((path) => pathname.startsWith(path));
  const isAuthRoute = AUTH_ROUTES.some((path) => pathname.startsWith(path));
  const isGuestWishlist = pathname.startsWith('/wishlists') && !!pathname.split('/')[2] && !isUUID(pathname.split('/')[2]);

  if ((isProtected && !isGuestWishlist) && !isAuth) {
    return NextResponse.redirect(new URL("/auth/signin?redirect=" + pathname, request.url));
  }

  if (isAuthRoute && isAuth) {
    return NextResponse.redirect(new URL("/collection/skins", request.url));
  }

  return NextResponse.next({
    request: {
      ...request,
      headers: new Headers({
        ...Object.fromEntries(request.headers),
        "x-pathname": pathname,
      }),
    },
  });
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)"],
};
