import { NextRequest } from "next/server";

import { errorHandler, RequestError } from "@/errors";
import { getServerUserPayload } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { buildWishlistChromasPreview } from '@/shared/utils/buildWishlistChromasPreview';
import { buildWishlistSkinsPreview } from '@/shared/utils/buildWishlistSkinsPreview';
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getPrices } from "@/shared/utils/getPrices";

export const GET = async (_: NextRequest, { params }: { params: Promise<{ wishlistId: string }> }) => {
  try {
    const supabase = await createClient();
    const { wishlistId } = await params;

    const payload = await getServerUserPayload();
    if (!payload) throw new RequestError({ code: "ERR_0001", status: 401 });

    const [{ data: wishlist, error }, { data: ownedSkins }, { data: ownedChromas }, appData, appPrices] = await Promise.all([
      supabase.from("wishlists").select("*, user:user_id(*)").eq("id", wishlistId).eq("user_id", payload.userId).single(),
      supabase.from("user_skins").select("contentId").eq("user_id", payload.userId),
      supabase.from("user_chromas").select("contentId").eq("user_id", payload.userId),
      getLangAppData(),
      getPrices(),
    ]);

    if (!wishlist || error) throw new RequestError({ code: "ERR_0000", status: 500, message: error.message });

    const ownedSkinIds = new Set((ownedSkins ?? []).map((r) => r.contentId));
    const ownedChromaIds = new Set((ownedChromas ?? []).map((r) => r.contentId));
    const ownedWishlistSkins = wishlist.skins.filter((id: string) => ownedSkinIds.has(id));
    const ownedWishlistChromas = wishlist.chromas.filter((id: string) => ownedChromaIds.has(id));

    const isSkinExalted = (skinContentId: string) => {
      return (appData?.skins ?? []).find((s) => s.contentId === skinContentId)?.rarity === "kExalted";
    };

    return Response.json({
      ...wishlist,
      preview: {
        skins: buildWishlistSkinsPreview(wishlist, appData?.skins ?? [], 4),
        chromas: buildWishlistChromasPreview(wishlist, appData?.chromas ?? [], 4),
      },
      owned: {
        skins: ownedWishlistSkins.length,
        chromas: ownedWishlistChromas.length,
      },
      price: {
        total: [...wishlist.skins, ...wishlist.chromas].reduce((acc, curr) => {
          return (acc += isSkinExalted(curr) ? 32000 : (appPrices.find((p) => p.contentId === curr)?.price ?? 0));
        }, 0),
        owned: [...ownedWishlistSkins, ...ownedWishlistChromas].reduce((acc, curr) => {
          return (acc += isSkinExalted(curr) ? 32000 : (appPrices.find((p) => p.contentId === curr)?.price ?? 0));
        }, 0),
      },
    });
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
