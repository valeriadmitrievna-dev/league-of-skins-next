import { compare } from "bcrypt";
import { createClient } from "@/lib/supabase/server";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { setAuthCookies } from "@/lib/cookies";
import { endpoint } from "@/lib/endpoint";
import { RequestError } from "@/errors";

export const POST = endpoint(async ({ body }) => {
  const { email, password } = await body<{ email: string; password: string }>();
  const supabase = await createClient();

  const emptyFields = Object.entries({ email, password })
    .filter(([, v]) => !v?.trim().length)
    .map(([k]) => k);

  if (emptyFields.length) throw new RequestError({ code: "ERR_0005", status: 400 });

  const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single();
  if (!user || error) throw new RequestError({ code: "ERR_0007" });

  const valid = await compare(password, user.password);
  if (!valid) throw new RequestError({ code: "ERR_0008", status: 400 });

  const access = signAccessToken(user.id);
  const refresh = signRefreshToken(user.id);

  const { error: insertError } = await supabase.from("refresh_tokens").insert({
    token: refresh,
    user_id: user.id,
  });

  await setAuthCookies(access, refresh);

  return { ok: true };
});
