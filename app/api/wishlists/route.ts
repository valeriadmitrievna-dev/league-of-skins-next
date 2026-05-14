import { NextRequest } from "next/server";

import { errorHandler, RequestError } from "@/errors";
import { getServerUserPayload } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { buildWishlistChromasPreview } from "@/shared/utils/buildWishlistChromasPreview";
import { buildWishlistSkinsPreview } from "@/shared/utils/buildWishlistSkinsPreview";
import { generateWishlistLink } from "@/shared/utils/generateWishlistLink";
import { getLangAppData } from "@/shared/utils/getLangAppData";

export const GET = async () => {
  try {
    const supabase = await createClient();
    const payload = await getServerUserPayload();
    if (!payload) throw new RequestError({ code: "ERR_0001", status: 401, message: "Invalid access token" });

    const { userId } = payload;

    const [{ data: wishlists, error }, { data: ownedSkins }, { data: ownedChromas }, appData] = await Promise.all([
      supabase.from("wishlists").select("*, user:user_id(*)").eq("user_id", userId).order("created_at", { ascending: true }),
      supabase.from("user_skins").select("contentId").eq("user_id", userId),
      supabase.from("user_chromas").select("contentId").eq("user_id", userId),
      getLangAppData(),
    ]);

    if (!wishlists || error) throw new RequestError({ code: "ERR_0000", status: 500, message: error.message });

    const skins = appData?.skins ?? [];
    const chromas = appData?.chromas ?? [];

    const ownedSkinIds = new Set((ownedSkins ?? []).map((r) => r.contentId));
    const ownedChromaIds = new Set((ownedChromas ?? []).map((r) => r.contentId));

    const result = wishlists.map((wishlist) => ({
      ...wishlist,
      preview: {
        skins: buildWishlistSkinsPreview(wishlist, skins),
        chromas: buildWishlistChromasPreview(wishlist, chromas),
      },
      owned: {
        skins: wishlist.skins.filter((id: string) => ownedSkinIds.has(id)).length,
        chromas: wishlist.chromas.filter((id: string) => ownedChromaIds.has(id)).length,
      },
    }));

    return Response.json(result);
  } catch (error) {
    return errorHandler(error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const payload = await getServerUserPayload();
    if (!payload) throw new RequestError({ code: "ERR_0001", status: 401, message: "No access token" });

    const supabase = await createClient();
    const { userId } = payload;
    const {
      name,
      private: isPrivate,
      skins,
      chromas,
    } = (await req.json()) as { name: string; private: boolean; skins?: string[]; chromas?: string[] };

    const { data: wishlist, error } = await supabase
      .from("wishlists")
      .insert({
        user_id: userId,
        name,
        private: isPrivate,
        link: generateWishlistLink(),
        skins,
        chromas,
      })
      .select()
      .single();

    if (error) throw new RequestError({ code: "ERR_0000", status: 500, message: error.message });

    return Response.json(wishlist);
  } catch (error) {
    return errorHandler(error);
  }
};
