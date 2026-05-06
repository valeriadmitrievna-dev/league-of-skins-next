import jwt from "jsonwebtoken";

import { DbUser } from '@/types/db';

import { config } from "./config";

export type TokenPayload = {
  userId: string;
  role: DbUser['role']
}

export const signAccessToken = (data: TokenPayload) => {
  return jwt.sign(data, config.jwtAccessSecret, { expiresIn: `${config.accessTokenLiveInMinutes}m` });
};

export const signRefreshToken = (data: TokenPayload) => {
  return jwt.sign(data, config.jwtRefreshSecret, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwtRefreshSecret) as TokenPayload;
  } catch {
    return null;
  }
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwtAccessSecret) as TokenPayload;
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
