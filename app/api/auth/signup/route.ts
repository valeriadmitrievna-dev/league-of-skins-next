import { hash } from "bcrypt";
import { NextRequest } from "next/server";

import { RequestError } from "@/errors";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { setAuthCookies } from "@/lib/cookies";
import { createClient } from "@/lib/supabase/server";

export const POST = async (req: NextRequest) => {
  const { email, password, name } = await req.json() as { email: string; password: string; name: string };
  const supabase = await createClient();

  const emptyFields = Object.entries({ email, password, name })
    .filter(([, v]) => !v?.trim().length)
    .map(([k]) => k);

  if (emptyFields.length) throw new RequestError({ code: "ERR_0005", status: 400 });

  const { data: existingUser } = await supabase.from("users").select("*").eq("email", email).single();
  if (existingUser) throw new RequestError({ code: "ERR_0006", status: 400 });

  const hashed = await hash(password, 10);

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      email: email,
      password: hashed,
      name: name,
      updated_at: String(new Date()),
      created_at: String(new Date()),
    })
    .select()
    .single();

  if (error) throw new RequestError({ code: "ERR_0000", status: 500, message: error.message });

  const access = signAccessToken({ userId: user.id, role: user.role });
  const refresh = signRefreshToken({ userId: user.id, role: user.role });

  await supabase.from("refresh_tokens").insert({
    token: refresh,
    user_id: user.id,
  });

  await setAuthCookies(access, refresh);

  return Response.json({ ok: true });
};
