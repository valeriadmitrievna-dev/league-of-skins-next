import { NextRequest } from "next/server";

import { getLangCookie } from "@/lib/cookies";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";
import { getServerUser } from "@/shared/utils/getServerUser";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const { page, size, inventory } = Object.fromEntries(searchParams.entries());
  const lang = await getLangCookie();
  const appData = await getLangAppData(getLanguageCode(lang));
  const champions = appData?.champions ?? [];

  if (inventory === "true") {
    const skins = appData?.skins ?? [];
    const user = await getServerUser();
    const ownedSkins = skins.filter((skin) => user.owned_skins.includes(skin.contentId));
    const result = champions.filter(c => ownedSkins.find(s => c.id === s.championId))

    return Response.json({
      count: result.length,
      data: getPaginatedSlice(result, page, size),
    });
  }

  return Response.json({
    count: champions.length,
    data: getPaginatedSlice(champions, page, size),
  });
};
