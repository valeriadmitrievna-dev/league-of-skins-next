import { compare } from "bcrypt";
import { NextRequest } from "next/server";

import { errorHandler, RequestError } from "@/errors";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { setAuthCookies } from "@/lib/cookies";
import { createClient } from "@/lib/supabase/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = (await req.json()) as { email: string; password: string };
    const supabase = await createClient();

    const emptyFields = Object.entries({ email, password })
      .filter(([, v]) => !v?.trim().length)
      .map(([k]) => k);

    if (emptyFields.length) throw new RequestError({ code: "ERR_0005", status: 400 });

    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single();
    if (!user || error) throw new RequestError({ code: "ERR_0007" });

    const valid = await compare(password, user.password);
    if (!valid) throw new RequestError({ code: "ERR_0008", status: 400 });

    const access = signAccessToken({ userId: user.id, role: user.role });
    const refresh = signRefreshToken({ userId: user.id, role: user.role });

    await supabase.from("refresh_tokens").insert({
      token: refresh,
      user_id: user.id,
    });

    await setAuthCookies(access, refresh);

    return Response.json({ ok: true });
  } catch (error) {
    return errorHandler(error);
  }
};
