import { hash } from "bcrypt";
import { NextRequest } from "next/server";

import { errorHandler, RequestError } from "@/errors";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { setAuthCookies } from "@/lib/cookies";
import { createAndSendVerification } from "@/lib/emailVerification";
import { createClient } from "@/lib/supabase/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password, name } = (await req.json()) as {
      email: string;
      password: string;
      name: string;
    };

    const emptyFields = Object.entries({ email, password, name })
      .filter(([, v]) => !v?.trim().length)
      .map(([k]) => k);

    if (emptyFields.length) throw new RequestError({ code: "ERR_0005", status: 400 });

    const supabase = await createClient();

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existingUser) throw new RequestError({ code: "ERR_0006", status: 400 });

    const hashed = await hash(password, 10);
    const now = new Date().toISOString();

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        email: email.toLowerCase().trim(),
        password: hashed,
        name: name.trim(),
        is_verified: false,
        updated_at: now,
        created_at: now,
      })
      .select()
      .single();

    if (error || !user) throw new RequestError({ code: "ERR_0000", status: 500, message: error?.message });

    // Отправляем письмо с подтверждением — не блокируем ответ при ошибке отправки
    await createAndSendVerification(user.id, user.email).catch((err) =>
      console.error("Failed to send verification email:", err),
    );

    const payload = { userId: user.id, userName: user.name, role: user.role, verified: user.is_verified };
    const access = signAccessToken(payload);
    const refresh = signRefreshToken(payload);

    await setAuthCookies(access, refresh);

    return Response.json({ ok: true });
  } catch (error) {
    return errorHandler(error);
  }
};
