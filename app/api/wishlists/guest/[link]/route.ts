import { NextRequest } from "next/server";

import { errorHandler, RequestError } from "@/errors";
import { getServerUserPayload } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ link: string }> },
) => {
  try {
    const { link } = await params;

    const [supabase, payload] = await Promise.all([
      createClient(),
      getServerUserPayload(),
    ]);

    const { data: wishlist, error } = await supabase
      .from("wishlists")
      .select("*")
      .eq("link", link)
      .single();

    if (!wishlist || error) {
      throw new RequestError({
        code: "ERR_0404",
        status: 404,
        message: error?.message ?? "Wishlist not found",
      });
    }

    if (wishlist.private) {
      throw new RequestError({ code: "ERR_0403", status: 403 });
    }

    if (payload?.userId === wishlist.user_id) {
      return Response.json({ __redirect: wishlist.id });
    }

    return Response.json(wishlist);
  } catch (error) {
    return errorHandler(error);
  }
};