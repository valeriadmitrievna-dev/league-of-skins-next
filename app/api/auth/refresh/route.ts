import { cookies } from "next/headers";

import { errorHandler, RequestError } from "@/errors";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/auth";
import { setAuthCookies } from "@/lib/cookies";

/**
 * Stateless refresh: токен верифицируется криптографически через JWT-подпись.
 * Никаких запросов в БД — нет race condition при параллельных запросах.
 *
 * Компромисс: отозвать конкретный refresh-токен (например, при смене пароля)
 * нельзя без отдельного blocklist. Если это нужно — добавляй отдельно,
 * не возвращая таблицу refresh_tokens в основной флоу.
 */
export const POST = async () => {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      throw new RequestError({ code: "ERR_0001", status: 401, message: "No refresh token" });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new RequestError({ code: "ERR_0001", status: 401, message: "Refresh token invalid or expired" });
    }

    const { userId, userName, role } = payload;
    const newAccess = signAccessToken({ userId, userName, role });
    const newRefresh = signRefreshToken({ userId, userName, role });

    await setAuthCookies(newAccess, newRefresh);

    return Response.json({ ok: true });
  } catch (error) {
    return errorHandler(error);
  }
};
