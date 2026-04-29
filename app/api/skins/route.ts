import { createSkinPredicate } from '@/shared/utils/createSkinPredicate';
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from '@/shared/utils/getLanguageCode';
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const lang = getLanguageCode(req.headers.get("Language") ?? "en");

    const { page, size, ...params } = Object.fromEntries(req.nextUrl.searchParams);

    const originAppData = await getLangAppData();
    const appData = await getLangAppData(lang);
    
    const predicate = await createSkinPredicate(params, null, lang);
    const filteredSkins = appData.skins.filter(predicate);

    const skins = filteredSkins.map(skin => {
      const originSkin = originAppData.skins.find(originSkin => originSkin.contentId === skin.contentId);
      // return { ...skin, ...(user ? { owned: user.ownedSkins.includes(skin.contentId) } : {}), originName: originSkin?.name }
      return { ...skin, originName: originSkin?.name };
    })

    return Response.json({
      count: skins.length,
      data: getPaginatedSlice(skins, page, size),
    });
  } catch {
    return Response.json({ code: "ERR_0000" }, { status: 500 });
  }
}
