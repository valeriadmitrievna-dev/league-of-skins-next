import { NextRequest } from "next/server";

import { errorHandler, RequestError } from "@/errors";
import { createClient } from "@/lib/supabase/server";

export const GET = async (req: NextRequest) => {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) throw new RequestError({ code: "ERR_0001", status: 400, message: "No token" });

    const supabase = await createClient();

    const { data: record } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("token", token)
      .single();

    if (!record) {
      throw new RequestError({ code: "ERR_0001", status: 400, message: "Invalid or already used token" });
    }

    if (new Date(record.expires_at) < new Date()) {
      await supabase.from("email_verifications").delete().eq("token", token);
      throw new RequestError({ code: "ERR_0001", status: 400, message: "Token expired" });
    }

    await Promise.all([
      supabase.from("users").update({ is_verified: true }).eq("id", record.user_id),
      supabase.from("email_verifications").delete().eq("token", token),
    ]);

    return Response.json({ ok: true });
  } catch (error) {
    return errorHandler(error);
  }
};
