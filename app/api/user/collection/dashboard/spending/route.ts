import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import { getPrices } from '@/shared/utils/getPrices';
import { getServerUserOwned } from "@/shared/utils/getServerUserOwned";
import { RarityEntry, StatsSpendingResponse } from "@/types/dashboard";

export const GET = async (_req: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const lng = cookieStore.get("i18next")?.value ?? "en";

    const [appData, { ownedSkinIds }] = await Promise.all([
      getLangAppData(getLanguageCode(lng)),
      getServerUserOwned(),
    ]);

    const appPrices = await getPrices();

    const allSkins = (appData?.skins ?? []).filter((s) => !s.pbe);
    const allChampions = appData?.champions ?? [];

    const ownedSkins = allSkins.filter((s) => ownedSkinIds.has(s.contentId));

    const totalRp = ownedSkins.reduce((sum, s) => {
      const price = appPrices.find(p => p.contentId === s.contentId)?.price ?? 0

      if (s.rarity === 'kExalted') return sum + 32000;
      return sum + (price ?? 0);
    }, 0);

    const rarityOwnedMap = new Map<string, number>();
    const rarityTotalMap = new Map<string, number>();

    for (const skin of allSkins) {
      rarityTotalMap.set(skin.rarity, (rarityTotalMap.get(skin.rarity) ?? 0) + 1);
      if (ownedSkinIds.has(skin.contentId)) {
        rarityOwnedMap.set(skin.rarity, (rarityOwnedMap.get(skin.rarity) ?? 0) + 1);
      }
    }

    const rarity: RarityEntry[] = [...rarityTotalMap.entries()].map(([r, total]) => ({
      rarity: r,
      owned: rarityOwnedMap.get(r) ?? 0,
      total,
    }));

    const rpByChampion = new Map<string, number>();
    for (const skin of ownedSkins) {
      let price = 0;
      
      if (skin.rarity = 'kExalted') {
        price = 32000;
      }

      if (appPrices.find(p => p.contentId === skin.contentId)) {
        price = appPrices.find(p => p.contentId === skin.contentId)!.price;
      }

      rpByChampion.set(skin.championId, (rpByChampion.get(skin.championId) ?? 0) + price);
    }

    let mostExpensiveChampion: StatsSpendingResponse["mostExpensiveChampion"] = null;
    if (rpByChampion.size > 0) {
      const [topId, topRp] = [...rpByChampion.entries()].sort((a, b) => b[1] - a[1])[0];
      const champion = allChampions.find((c) => c.id === topId);
      if (champion) {
        mostExpensiveChampion = {
          champion: champion,
          totalRp: topRp,
        };
      }
    }

    const response: StatsSpendingResponse = { totalRp, rarity, mostExpensiveChampion };

    return Response.json(response);
  } catch (error) {
    return errorHandler(error);
  }
};