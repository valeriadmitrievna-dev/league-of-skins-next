import { omit } from 'lodash';
import { cookies } from "next/headers";

import { errorHandler, RequestError } from "@/errors";
import { verifyAccessToken } from "@/lib/auth";
import { createClient } from '@/lib/supabase/server';

export const GET = async () => {
  try {
    const supabase = await createClient();
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) throw new RequestError({ code: "ERR_0001", status: 401 });

    const payload = verifyAccessToken(accessToken);
    if (!payload) throw new RequestError({ code: "ERR_0001", status: 401 });

    const { data: user, error } = await supabase.from("users").select("*").eq("id", payload.userId).single();
    if (!user || error) throw new RequestError({ code: "ERR_0001", status: 401, message: 'No user' });

    return Response.json(omit(user, 'password'));
  } catch (error) {
    return errorHandler(error);
  }
};
