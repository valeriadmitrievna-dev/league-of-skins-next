import { hash } from "bcrypt";
import { createClient } from "@/lib/supabase/server";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { setAuthCookies } from "@/lib/cookies";
import { RequestError } from "@/errors";
import { endpoint } from "@/lib/endpoint";
import { generateId } from '@/shared/utils/generateId';

export const POST = endpoint(async (req) => {
  const body: { email: string; password: string; name: string } = await req.json();
  const supabase = await createClient();

  const emptyFields = Object.entries(body)
    .filter(([, v]) => !v?.trim().length)
    .map(([k]) => k);

  if (emptyFields.length) throw new RequestError({ code: "ERR_0005", status: 400 });

  const { data: existingUser } = await supabase.from("users").select("*").eq("email", body.email).single();
  if (existingUser) throw new RequestError({ code: "ERR_0006", status: 400 });

  const hashed = await hash(body.password, 10);

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      id: generateId(),
      email: body.email,
      password: hashed,
      name: body.name,
      updated_at: new Date(),
    })
    .select()
    .single();

  if (error) throw new RequestError({ code: "ERR_0000", status: 500, message: error.message });

  const access = signAccessToken(user.id);
  const refresh = signRefreshToken(user.id);

  await supabase.from("refresh_tokens").insert({
    token: refresh,
    user_id: user.id,
  });

  setAuthCookies(access, refresh);

  return { ok: true };
});
