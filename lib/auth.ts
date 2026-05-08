import jwt from "jsonwebtoken";

import { DbUser } from "@/types/db";

import { config } from "./config";

export type TokenPayload = {
  userId: string;
  userName: string;
  role: DbUser["role"];
  verified: boolean;
};

export const signAccessToken = (data: TokenPayload) => {
  return jwt.sign(data, config.jwtAccessSecret, {
    expiresIn: `${config.accessTokenLiveInMinutes}m`,
  });
};

export const signRefreshToken = (data: TokenPayload) => {
  return jwt.sign(data, config.jwtRefreshSecret, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, config.jwtRefreshSecret) as TokenPayload;
  } catch {
    return null;
  }
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, config.jwtAccessSecret) as TokenPayload;
  } catch {
    return null;
  }
};

export const getServerUserPayload = async (): Promise<TokenPayload | null> => {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;
  const payload = verifyAccessToken(token);
  return payload ?? null;
};
