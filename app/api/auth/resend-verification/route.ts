import { NextRequest } from 'next/server';

import { errorHandler, RequestError } from "@/errors";
import { getServerUserPayload } from "@/lib/auth";
import { createAndSendVerification } from "@/lib/emailVerification";
import { createClient } from "@/lib/supabase/server";

export const POST = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const { from } = Object.fromEntries(searchParams.entries());
    const userPayload = await getServerUserPayload();
    const { userId } = userPayload ?? {};
    if (!userId) throw new RequestError({ code: "ERR_0001", status: 401 });

    const supabase = await createClient();
    const { data: user } = await supabase
      .from("users")
      .select("id, email, is_verified")
      .eq("id", userId)
      .single();

    if (!user) throw new RequestError({ code: "ERR_0004", status: 404 });
    if (user.is_verified) {
      throw new RequestError({ code: "ERR_0001", status: 400, message: "Already verified" });
    }

    await createAndSendVerification(user.id, user.email, from);

    return Response.json({ ok: true });
  } catch (error) {
    return errorHandler(error);
  }
};
