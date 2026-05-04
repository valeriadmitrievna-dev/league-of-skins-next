import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { getLangCookie } from "@/lib/cookies";
import { createSkinPredicate } from "@/shared/utils/createSkinPredicate";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";
import { AppDataSkin } from "@/types/appdata";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const { page, size, ...params } = Object.fromEntries(searchParams.entries());
    const lang = await getLangCookie();

    const originAppData = await getLangAppData();
    const appData = await getLangAppData(getLanguageCode(lang));
    if (!appData) return Response.json({ count: 0, data: [] });

    const predicate = await createSkinPredicate(params, null, getLanguageCode(lang));
    const filteredSkins = appData.skins.filter(predicate);

    const skins: AppDataSkin[] = filteredSkins.map((skin) => {
      const originSkin = originAppData.skins.find((originSkin) => originSkin.contentId === skin.contentId);
      return { ...skin, originName: originSkin?.name };
      // return { ...skin, ...(user ? { owned: user.owned_skins.includes(skin.contentId) } : {}), originName: originSkin?.name };
    });

    return Response.json({
      count: skins.length,
      data: getPaginatedSlice(skins, page, size),
    });
  } catch (error) {
    return errorHandler(error);
  }
};
