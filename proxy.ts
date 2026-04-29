import { NextRequest, NextResponse } from "next/server";

let locales = ["en", "ru"];

const getLocale = (request: NextRequest) => {
  return "ru";
};

export const proxy = (request: NextRequest) => {
//   const { pathname } = request.nextUrl;
//   const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

//   if (pathnameHasLocale) return;

//   const locale = getLocale(request);
//   request.nextUrl.pathname = `/${locale}${pathname}`;
//   return NextResponse.redirect(request.nextUrl);
};
