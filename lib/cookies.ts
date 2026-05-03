import { cookies } from "next/headers";

export const ACCESS_COOKIE = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  path: "/",
  maxAge: 60 * 15,
};

export const REFRESH_COOKIE = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export const serializeCookie = (name: string, value: string, options: typeof ACCESS_COOKIE) => {
  return `${name}=${value}; HttpOnly; Secure; SameSite=${options.sameSite}; Path=${options.path}; Max-Age=${options.maxAge}`;
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