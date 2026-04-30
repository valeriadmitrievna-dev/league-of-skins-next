import jwt from "jsonwebtoken";
import { config } from "./config";

export const signAccessToken = (userId: string) => {
  return jwt.sign({ userId }, config.jwtAccessSecret, { expiresIn: "15m" });
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
