import { cookies } from "next/headers";

import { errorHandler, RequestError } from "@/errors";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/auth";
import { setAuthCookies } from "@/lib/cookies";
import { createClient } from "@/lib/supabase/server";

export const POST = async () => {
  try {
    console.log("[REFRESH]", "start refresh");
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) throw new RequestError({ code: "ERR_0001", status: 401 });
    console.log("[REFRESH]", "got cookie refresh token");

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) throw new RequestError({ code: "ERR_0001", status: 401 });
    console.log("[REFRESH]", "got payload:", JSON.stringify(payload));

    const supabase = await createClient();

    const { data: storedToken } = await supabase.from("refresh_tokens").select("*").eq("token", refreshToken).single();
    if (!storedToken) throw new RequestError({ code: "ERR_0001", status: 401 });
    console.log("[REFRESH]", "got database refresh token");

    await supabase.from("refresh_tokens").delete().eq("token", refreshToken);
    console.log("[REFRESH]", "deleted old refresh token from database");
    const newAccessToken = signAccessToken(payload.userId);
    const newRefreshToken = signRefreshToken(payload.userId);

    await supabase.from("refresh_tokens").insert({
      token: newRefreshToken,
      user_id: payload.userId,
    });
    console.log("[REFRESH]", "stored new refresh token");

    await setAuthCookies(newAccessToken, newRefreshToken);
    console.log("[REFRESH]", "set new tokens for cookie");

    return Response.json({ ok: true })
  } catch (error) {
    return errorHandler(error);
  }
};
