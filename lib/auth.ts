import jwt from "jsonwebtoken";

import { config } from "./config";
import { createClient } from "./supabase/server";

export const signAccessToken = (userId: string) => {
  return jwt.sign({ userId }, config.jwtAccessSecret, { expiresIn: "5m" });
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

export const getServerUser = async () => {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  const payload = verifyAccessToken(token);
  if (!payload) return null;

  const supabase = await createClient();

  const { data: user } = await Promise.race([
    supabase.from("users").select("*").eq("id", payload.userId).single(),
    new Promise<{ data: null }>((resolve) => setTimeout(() => resolve({ data: null }), 3000)),
  ]);

  return user ?? null;
};
