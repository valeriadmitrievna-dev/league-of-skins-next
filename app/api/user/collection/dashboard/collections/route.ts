import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import { getRandomFromArray } from '@/shared/utils/getRandomFromArray';
import { getServerUserOwned } from "@/shared/utils/getServerUserOwned";
import { ChampionProgress, SkinChromaProgress, SkinlineProgress, StatsCollectionsResponse } from "@/types/dashboard";

const MIN_SKINLINE_SIZE = 2;
const TARGET_ENTRIES = 5;

const pickTopN = <T extends { completed: boolean; owned: number; total: number }>(entries: T[], n: number): T[] => {
  const completed = entries.filter((e) => e.completed);
  if (completed.length >= n) return completed;

  const incomplete = entries.filter((e) => !e.completed).sort((a, b) => b.owned / b.total - a.owned / a.total);

  return [...completed, ...incomplete].slice(0, n);
};

export const GET = async (_req: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const lng = cookieStore.get("i18next")?.value ?? "en";

    const [appData, { ownedSkinIds, ownedChromaIds }] = await Promise.all([getLangAppData(getLanguageCode(lng)), getServerUserOwned()]);

    const allSkins = (appData?.skins ?? []).filter((s) => !s.pbe);
    const allChromas = (appData?.chromas ?? []).filter((c) => !c.pbe);
    const allChampions = appData?.champions ?? [];

    const skinlineMap = new Map<string, { name: string; total: Set<string>; owned: Set<string> }>();

    for (const skin of allSkins) {
      for (const sl of skin.skinlines) {
        if (!skinlineMap.has(sl.id)) {
          skinlineMap.set(sl.id, { name: sl.name, total: new Set(), owned: new Set() });
        }
        const entry = skinlineMap.get(sl.id)!;
        entry.total.add(skin.contentId);
        if (ownedSkinIds.has(skin.contentId)) entry.owned.add(skin.contentId);
      }
    }

    const skinlineProgress: SkinlineProgress[] = [...skinlineMap.entries()]
      .filter(([, v]) => v.total.size >= MIN_SKINLINE_SIZE)
      .map(([id, v]) => {
        const skin = getRandomFromArray(allSkins.filter(s => !!s.skinlines.find(sl => sl.id === id)))
        return {
          id,
          name: v.name,
          owned: v.owned.size,
          total: v.total.size,
          completed: v.owned.size === v.total.size,
          image: skin.image,
        };
      });

    const skinlines = pickTopN(skinlineProgress, TARGET_ENTRIES);

    const championSkinMap = new Map<string, { total: Set<string>; owned: Set<string> }>();

    for (const skin of allSkins) {
      if (!championSkinMap.has(skin.championId)) {
        championSkinMap.set(skin.championId, { total: new Set(), owned: new Set() });
      }
      const entry = championSkinMap.get(skin.championId)!;
      entry.total.add(skin.contentId);
      if (ownedSkinIds.has(skin.contentId)) entry.owned.add(skin.contentId);
    }

    const championProgress: ChampionProgress[] = [...championSkinMap.entries()]
      .filter(([, v]) => v.owned.size > 0)
      .map(([id, v]) => {
        const champion = allChampions.find((c) => c.id === id)!;
        return {
          id,
          key: champion?.key ?? id,
          name: champion?.name ?? id,
          owned: v.owned.size,
          total: v.total.size,
          completed: v.owned.size === v.total.size,
          image: champion?.image,
        };
      });

    const champions = pickTopN(championProgress, TARGET_ENTRIES);

    const leastCollectedChampions: ChampionProgress[] = [...championSkinMap.entries()]
      .filter(([, v]) => v.owned.size > 0 && v.owned.size < v.total.size)
      .map(([id, v]) => {
        const champion = allChampions.find((c) => c.id === id)!;
        return {
          id,
          key: champion?.key ?? id,
          name: champion?.name ?? id,
          owned: v.owned.size,
          total: v.total.size,
          completed: false,
          image: champion?.image,
        };
      })
      .sort((a, b) => a.owned / a.total - b.owned / b.total)
      .slice(0, TARGET_ENTRIES);

    const chromaBySkin = new Map<string, { total: Set<string>; owned: Set<string>; skinName: string; championId: string; championName: string }>();

    for (const chroma of allChromas) {
      if (!chromaBySkin.has(chroma.skinContentId)) {
        const champion = allChampions.find((c) => c.id === chroma.championId);
        chromaBySkin.set(chroma.skinContentId, {
          total: new Set(),
          owned: new Set(),
          skinName: chroma.skinName,
          championId: chroma.championId,
          championName: champion?.name ?? chroma.championId,
        });
      }
      const entry = chromaBySkin.get(chroma.skinContentId)!;
      entry.total.add(chroma.contentId);
      if (ownedChromaIds.has(chroma.contentId)) entry.owned.add(chroma.contentId);
    }

    const skinChromaProgress: SkinChromaProgress[] = [...chromaBySkin.entries()]
      .filter(([, v]) => v.owned.size > 0)
      .map(([skinId, v]) => {
        const skin = allSkins.find((s) => s.contentId === skinId)!;
        return {
          skinId,
          skinName: v.skinName,
          championId: v.championId,
          championName: v.championName,
          owned: v.owned.size,
          total: v.total.size,
          completed: v.owned.size === v.total.size,
          image: skin?.image,
        };
      });

    const skinChromas = pickTopN(skinChromaProgress, TARGET_ENTRIES);

    const response: StatsCollectionsResponse = {
      skinlines,
      champions,
      leastCollectedChampions,
      skinChromas,
    };

    return Response.json(response);
  } catch (error) {
    return errorHandler(error);
  }
};
