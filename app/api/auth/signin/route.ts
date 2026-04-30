import { compare } from "bcrypt";
import { createClient } from "@/lib/supabase/server";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { setAuthCookies } from "@/lib/cookies";
import { endpoint } from "@/lib/endpoint";
import { RequestError } from "@/errors";

export const POST = endpoint(async (req) => {
  const body: { email: string; password: string } = await req.json();
  const supabase = await createClient();

  const emptyFields = Object.entries(body)
    .filter(([, v]) => !v?.trim().length)
    .map(([k]) => k);

  if (emptyFields.length) throw new RequestError({ code: "ERR_0005", status: 400 });

  const { data: user, error } = await supabase.from("users").select("*").eq("email", body.email).single();
  if (!user || error) throw new RequestError({ code: "ERR_0007" });

  const valid = await compare(body.password, user.password);
  if (!valid) throw new RequestError({ code: "ERR_0008", status: 400 });

  const access = signAccessToken(user.id);
  const refresh = signRefreshToken(user.id);

  await supabase.from("refresh_tokens").insert({
    token: refresh,
    user_id: user.id,
  });

  setAuthCookies(access, refresh);

  return { ok: true };
});
