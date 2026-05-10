import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import { getServerUserOwned } from "@/shared/utils/getServerUserOwned";
import { StatsOverviewResponse } from "@/types/dashboard";

export const GET = async (_req: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const lng = cookieStore.get("i18next")?.value ?? "en";

    const [appData, { ownedSkinIds, ownedChromaIds }] = await Promise.all([
      getLangAppData(getLanguageCode(lng)),
      getServerUserOwned(),
    ]);

    const allSkins = (appData?.skins ?? []).filter((s) => !s.pbe);
    const allChromas = (appData?.chromas ?? []).filter((c) => !c.pbe);
    const allChampions = appData?.champions ?? [];

    const skinCountByChampion = new Map<string, number>();
    for (const skin of allSkins) {
      if (ownedSkinIds.has(skin.contentId)) {
        skinCountByChampion.set(skin.championId, (skinCountByChampion.get(skin.championId) ?? 0) + 1);
      }
    }

    const maxSkinCount = Math.max(0, ...skinCountByChampion.values());
    const topChampionIds = maxSkinCount > 0
      ? [...skinCountByChampion.entries()]
          .filter(([, count]) => count === maxSkinCount)
          .map(([id]) => id)
      : [];

    const topChampions = topChampionIds.map((id) => {
      const champion = allChampions.find((c) => c.id === id)!;
      return { champion: { id: champion.id, key: champion.key, name: champion.name }, count: maxSkinCount };
    });

    const ownedSkinsCount = allSkins.filter((s) => ownedSkinIds.has(s.contentId)).length;

    const championsWithOwnedSkins = new Set(
      allSkins.filter((s) => ownedSkinIds.has(s.contentId)).map((s) => s.championId)
    );

    const legacySkins = allSkins.filter((s) => s.isLegacy);
    const ownedLegacyCount = legacySkins.filter((s) => ownedSkinIds.has(s.contentId)).length;

    const ownedChromasCount = allChromas.filter((c) => ownedChromaIds.has(c.contentId)).length;

    const response: StatsOverviewResponse = {
      topChampions,
      skinsTotal: { owned: ownedSkinsCount, total: allSkins.length },
      championsWithSkins: { owned: championsWithOwnedSkins.size, total: allChampions.length },
      legacySkins: { owned: ownedLegacyCount, total: legacySkins.length },
      chromasTotal: { owned: ownedChromasCount, total: allChromas.length },
    };

    return Response.json(response);
  } catch (error) {
    return errorHandler(error);
  }
};