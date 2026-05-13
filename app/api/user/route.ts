import { omit } from 'lodash';

import { errorHandler, RequestError } from "@/errors";
import { getServerUserPayload } from "@/lib/auth";
import { createClient } from '@/lib/supabase/server';

export const GET = async () => {
  try {
    const supabase = await createClient();
    const payload = await getServerUserPayload();
    if (!payload) throw new RequestError({ code: "ERR_0001", status: 401 });

    const { data: user, error } = await supabase.from("users").select("*").eq("id", payload.userId).single();
    if (!user || error) throw new RequestError({ code: "ERR_0001", status: 401, message: error.message ?? 'No user' });

    return Response.json(omit(user, 'password'));
  } catch (error) {
    return errorHandler(error);
  }
};
