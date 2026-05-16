import { NextRequest } from "next/server";

import { errorHandler, RequestError } from "@/errors";
import { getLangCookie } from "@/lib/cookies";
import { createClient } from "@/lib/supabase/server";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getPaginatedSlice } from '@/shared/utils/getPaginatedSlice';

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const { wishlistId, page, size } = Object.fromEntries(searchParams.entries());
    const lang = await getLangCookie();
    const appData = await getLangAppData(lang);
    const chromas = appData?.chromas ?? [];

    const supabase = await createClient();
    const { data: wishlist, error } = await supabase.from("wishlists").select("*").eq("id", wishlistId).single();

    if (!wishlist || error) throw new RequestError({ code: "ERR_0000", status: 500, message: error.message });

    const result = chromas.filter((chroma) => wishlist.chromas.includes(chroma.contentId))

    const indexMap = new Map(wishlist.chromas.map((r, i) => [r, i]));
    const sorted = result.sort((a, b) => (indexMap.get(a.contentId) ?? 0) - (indexMap.get(b.contentId) ?? 0));

    return Response.json({ count: sorted.length, data: getPaginatedSlice(sorted, page, size) })
  } catch (error) {
    return errorHandler(error);
  }
};
