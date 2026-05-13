import { NextRequest } from "next/server";

import { errorHandler, RequestError } from "@/errors";
import { getServerUserPayload } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const GET = async (_: NextRequest, { params }: { params: Promise<{ wishlistId: string }> }) => {
  try {
    const supabase = await createClient();
    const { wishlistId } = await params;

    const payload = await getServerUserPayload();
    if (!payload) throw new RequestError({ code: "ERR_0001", status: 401 });

    const { data: wishlist, error } = await supabase.from("wishlists").select("*").eq("id", wishlistId).eq("user_id", payload.userId).single();
    if (!wishlist || error) throw new RequestError({ code: "ERR_0000", status: 500, message: error.message });

    return Response.json(wishlist);
  } catch (error) {
    return errorHandler(error);
  }
};

export const DELETE = async (_: NextRequest, { params }: { params: Promise<{ wishlistId: string }> }) => {
  try {
    const supabase = await createClient();
    const { wishlistId } = await params;

    const { error } = await supabase.from("wishlists").delete().eq("id", wishlistId);
    if (error) throw new RequestError({ code: "ERR_0000", status: 500, message: error.message });

    return Response.json({ ok: true });
  } catch (error) {
    return errorHandler(error);
  }
};
