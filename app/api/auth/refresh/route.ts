import { cookies } from "next/headers";

import { errorHandler, RequestError } from "@/errors";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/auth";
import { setAuthCookies } from "@/lib/cookies";
import { createClient } from "@/lib/supabase/server";

export const POST = async () => {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) throw new RequestError({ code: "ERR_0001", status: 401, message: "No refresh token" });

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) throw new RequestError({ code: "ERR_0001", status: 401, message: "Refresh token invalid" });

    const supabase = await createClient();

    const { data: consumed, error } = await supabase.rpc("consume_refresh_token", { p_token: refreshToken });

    if (error || !consumed?.length) {
      throw new RequestError({ code: "ERR_0001", status: 401, message: "No stored token" });
    }

    const newAccessToken = signAccessToken(payload.userId);
    const newRefreshToken = signRefreshToken(payload.userId);

    await supabase.from("refresh_tokens").insert({
      token: newRefreshToken,
      user_id: payload.userId,
    });

    await setAuthCookies(newAccessToken, newRefreshToken);

    return Response.json({ ok: true });
  } catch (error) {
    return errorHandler(error);
  }
};
