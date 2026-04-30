import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { verifyRefreshToken, signAccessToken } from "@/lib/auth";

export const POST = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("refreshToken")?.value;

    if (!token) {
      return Response.json({ error: "No token" }, { status: 401 });
    }

    const supabase = await createClient();

    const payload = verifyRefreshToken(token);

    const { data: storedToken } = await supabase
      .from("refresh_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (!storedToken) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    const newAccess = signAccessToken(payload.userId);

    cookieStore.set("accessToken", newAccess, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 15,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
};