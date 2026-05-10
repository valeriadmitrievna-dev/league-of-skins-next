import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getServerUserOwned } from "@/shared/utils/getServerUserOwned";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const { inventory } = Object.fromEntries(searchParams.entries());

    const appData = await getLangAppData();
    const rarities = new Set([...(appData?.skins ?? []).map((s) => s.rarity)]);

    if (inventory === "true") {
      const skins = appData?.skins ?? [];
      const { ownedSkinIds } = await getServerUserOwned();
      const result = new Set(skins.filter((skin) => ownedSkinIds.has(skin.contentId)).map((s) => s.rarity));

      return Response.json([...result]);
    }

    return Response.json([...rarities]);
  } catch (error) {
    return errorHandler(error);
  }
};
