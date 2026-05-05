import { cookies } from "next/headers";

import { errorHandler, RequestError } from "@/errors";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/auth";
import { setAuthCookies } from "@/lib/cookies";
import { createClient } from "@/lib/supabase/server";

export const POST = async () => {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) throw new RequestError({ code: "ERR_0001", status: 401 });

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) throw new RequestError({ code: "ERR_0001", status: 401 });

    const supabase = await createClient();

    const { data: storedToken } = await supabase.from("refresh_tokens").select("*").eq("token", refreshToken).single();
    if (!storedToken) throw new RequestError({ code: "ERR_0001", status: 401 });

    await supabase.from("refresh_tokens").delete().eq("token", refreshToken);
    const newAccessToken = signAccessToken(payload.userId);
    const newRefreshToken = signRefreshToken(payload.userId);

    await supabase.from("refresh_tokens").insert({
      token: newRefreshToken,
      user_id: payload.userId,
    });

    await setAuthCookies(newAccessToken, newRefreshToken);

    return Response.json({ ok: true })
  } catch (error) {
    return errorHandler(error);
  }
};
