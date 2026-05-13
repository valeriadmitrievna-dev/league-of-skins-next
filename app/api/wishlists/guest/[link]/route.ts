import { NextRequest } from "next/server";

import { errorHandler, RequestError } from "@/errors";
import { createClient } from "@/lib/supabase/server";

export const GET = async (_: NextRequest, { params }: { params: Promise<{ link: string }> }) => {
  try {
    const supabase = await createClient();
    const { link } = await params;

    const { data: wishlist, error } = await supabase.from("wishlists").select("*").eq("link", link).single();
    if (!wishlist || error) throw new RequestError({ code: "ERR_0000", status: 500, message: error.message });
    if (wishlist.private) throw new RequestError({ code: "ERR_0000", status: 403 })

    return Response.json(wishlist);
  } catch (error) {
    return errorHandler(error);
  }
};
