import { cookies } from 'next/headers';

import { RequestError } from '@/errors';
import { verifyAccessToken } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const getServerUser = async () => {
  const supabase = await createClient();
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) throw new RequestError({ code: "ERR_0001", status: 401 });

  const payload = verifyAccessToken(accessToken);
  if (!payload) throw new RequestError({ code: "ERR_0001", status: 401 });

  const { data: user, error } = await supabase.from("users").select("*").eq("id", payload.userId).single();
  if (!user || error) throw new RequestError({ code: "ERR_0001", status: 401, message: error.message ?? "No user" });

  return user;
};
