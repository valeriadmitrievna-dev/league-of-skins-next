import { endpoint } from "@/lib/endpoint";
import { createSkinPredicate } from "@/shared/utils/createSkinPredicate";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";
import { AppDataSkin } from "@/types/appdata";

export const GET = endpoint(async ({ language, query, user }) => {
  const { page, size, ...params } = query();

  const originAppData = await getLangAppData();
  const appData = await getLangAppData(language);
  if (!appData) return { count: 0, data: [] };

  const predicate = await createSkinPredicate(params, user, language);
  const filteredSkins = appData.skins.filter(predicate);

  const skins: AppDataSkin[] = filteredSkins.map((skin) => {
    const originSkin = originAppData.skins.find((originSkin) => originSkin.contentId === skin.contentId);
    return { ...skin, ...(user ? { owned: user.owned_skins.includes(skin.contentId) } : {}), originName: originSkin?.name };
  });

  return {
    count: skins.length,
    data: getPaginatedSlice(skins, page, size),
  };
});
