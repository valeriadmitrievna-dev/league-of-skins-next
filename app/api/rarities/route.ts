import { NextRequest } from 'next/server';

import { errorHandler } from "@/errors";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getServerUser } from '@/shared/utils/getServerUser';

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
  const { inventory } = Object.fromEntries(searchParams.entries());

    const appData = await getLangAppData();
    const rarities = new Set([...(appData?.skins ?? []).map((s) => s.rarity)]);

    if (inventory === "true") {
        const skins = appData?.skins ?? [];
        const user = await getServerUser();
        const ownedSkins = skins.filter((skin) => user.owned_skins.includes(skin.contentId));
        const result = new Set(ownedSkins.map(s => s.rarity))
    
        return Response.json([...result]);
      }

    return Response.json([...rarities]);
  } catch (error) {
    return errorHandler(error);
  }
};
