import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export const POST = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("refreshToken")?.value;

  const supabase = await createClient();

  if (token) {
    await supabase
      .from("refresh_tokens")
      .delete()
      .eq("token", token);
  }

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  return Response.json({ ok: true });
};