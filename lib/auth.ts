import jwt from "jsonwebtoken";

import { config } from "./config";

export const signAccessToken = (userId: string) => {
  return jwt.sign({ userId }, config.jwtAccessSecret, { expiresIn: `${config.accessTokenLiveInMinutes}m` });
};

export const signRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, config.jwtRefreshSecret, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwtRefreshSecret) as { userId: string };
  } catch {
    return null;
  }
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwtAccessSecret) as { userId: string };
  } catch {
    return null;
  }
};

export const getServerUserId = async (): Promise<string | null> => {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;
  const payload = verifyAccessToken(token);
  return payload?.userId ?? null;
};
