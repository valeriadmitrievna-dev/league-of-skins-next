import { uniqBy } from "lodash";
import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { getLangCookie } from "@/lib/cookies";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";
import { getServerUserOwned } from "@/shared/utils/getServerUserOwned";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const { page, size, inventory } = Object.fromEntries(searchParams.entries());
    const lang = await getLangCookie();
    const appData = await getLangAppData(getLanguageCode(lang));
    const skinlines = appData?.skinlines.filter((s) => s.name) ?? [];

    if (inventory === "true") {
      const skins = appData?.skins ?? [];
      const { ownedSkinIds } = await getServerUserOwned();
      const ownedSkinlines = skins
        .filter((skin) => ownedSkinIds.has(skin.contentId))
        .flatMap((s) => s.skinlines);
      const result = uniqBy(ownedSkinlines, "id");

      return Response.json({
        count: result.length,
        data: getPaginatedSlice(result, page, size),
      });
    }

    return Response.json({
      count: skinlines.length,
      data: getPaginatedSlice(skinlines, page, size),
    });
  } catch (error) {
    return errorHandler(error);
  }
};