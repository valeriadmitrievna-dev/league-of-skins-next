import { cookies } from "next/headers";

import { config } from "./config";

export const ACCESS_COOKIE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * config.accessTokenLiveInMinutes,
};

export const REFRESH_COOKIE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export const getLangCookie = async () => {
  const cookieStore = await cookies();
  const lng = cookieStore.get("i18next")?.value ?? "en";
  return lng;
};

export const setAuthCookies = async (access: string, refresh: string) => {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", access, ACCESS_COOKIE);
  cookieStore.set("refreshToken", refresh, REFRESH_COOKIE);
};

export const clearAuthCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};
