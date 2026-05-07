import { cookies } from "next/headers";

import { errorHandler, RequestError } from "@/errors";
import { verifyAccessToken } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { buildWishlistPreview } from "@/shared/utils/buildWishlistPreview";
import { getLangAppData } from "@/shared/utils/getLangAppData";

export const GET = async () => {
  try {
    const supabase = await createClient();
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) throw new RequestError({ code: "ERR_0001", status: 401, message: "No access token" });

    const payload = verifyAccessToken(accessToken);
    if (!payload) throw new RequestError({ code: "ERR_0001", status: 401, message: "Invalid access token" });

    const { userId } = payload;
    const { data: wishlists, error } = await supabase.from("wishlists").select("*").eq("user_id", userId).order("created_at", { ascending: true });
    if (!wishlists || error) throw new RequestError({ code: "ERR_0000", status: 500 });

    const appData = await getLangAppData();
    const skins = appData?.skins ?? [];

    const result = wishlists.map((wishlist) => ({
      ...wishlist,
      preview: buildWishlistPreview(wishlist, skins),
    }));

    return Response.json(result);
  } catch (error) {
    return errorHandler(error);
  }
};
