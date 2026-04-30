import { cookies } from "next/headers";

export const setAuthCookies = async (access: string, refresh: string) => {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", access, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: "/",
    maxAge: 60 * 15,
  });

  cookieStore.set("refreshToken", refresh, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const clearAuthCookies = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};
