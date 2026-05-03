import { RequestError } from "@/errors";
import { signAccessToken, verifyRefreshToken } from "@/lib/auth";
import { ACCESS_COOKIE, serializeCookie } from "@/lib/cookies";
import { createClient } from "@/lib/supabase/server";

export const POST = async (req: Request) => {
  try {
    const cookieHeader = req.headers.get("cookie") ?? "";

    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("refreshToken="))
      ?.split("=")[1]
      ?.trim();

    if (!token) throw new RequestError({ code: "ERR_0001", status: 401 });

    const payload = verifyRefreshToken(token);

    if (!payload) throw new RequestError({ code: "ERR_0001", status: 401 });

    const supabase = await createClient();
    const { data: storedToken } = await supabase.from("refresh_tokens").select("*").eq("token", token).single();

    if (!storedToken) throw new RequestError({ code: "ERR_0001", status: 401 });

    const newAccess = signAccessToken(payload.userId);

    const response = Response.json({ ok: true });
    response.headers.append("Set-Cookie", serializeCookie("accessToken", newAccess, ACCESS_COOKIE));
    return response;
  } catch {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
};
