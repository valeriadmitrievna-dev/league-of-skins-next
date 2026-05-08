import { compare } from "bcrypt";
import { NextRequest } from "next/server";

import { errorHandler, RequestError } from "@/errors";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { setAuthCookies } from "@/lib/cookies";
import { createClient } from "@/lib/supabase/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = (await req.json()) as { email: string; password: string };

    const emptyFields = Object.entries({ email, password })
      .filter(([, v]) => !v?.trim().length)
      .map(([k]) => k);

    if (emptyFields.length) throw new RequestError({ code: "ERR_0005", status: 400 });

    const supabase = await createClient();
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (!user || error) throw new RequestError({ code: "ERR_0007", status: 401 });

    const valid = await compare(password, user.password);
    if (!valid) throw new RequestError({ code: "ERR_0008", status: 401 });

    const payload = { userId: user.id, userName: user.name, role: user.role };
    const access = signAccessToken(payload);
    const refresh = signRefreshToken(payload);

    await setAuthCookies(access, refresh);

    return Response.json({ ok: true, isVerified: user.is_verified });
  } catch (error) {
    return errorHandler(error);
  }
};
