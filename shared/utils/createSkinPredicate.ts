import { isEqual } from "lodash";

import { SearchSkinsRequest } from "@/api/types";
import { AppDataSkin } from "@/types/appdata";
import { DbUser } from "@/types/db";

import { checkSearch } from "./checkSearch";
import { getLangAppData } from "./getLangAppData";

export const createSkinPredicate = async (query: SearchSkinsRequest, user: DbUser | null, lang: string) => {
  const chromas = (await getLangAppData(lang))?.chromas || [];
  const chroma = chromas?.find((chroma) => chroma.id.toString() === query.chromaId?.toString());

  const filters = {
    byChampionId: (skin: AppDataSkin) => !query.championId || skin.championId === query.championId,
    bySearch: (skin: AppDataSkin) => !query.search || checkSearch(skin.name, query.search),
    bySkinline: (skin: AppDataSkin) => !query.skinlineId || skin.skinlines.some((s) => s.id.toString() === query.skinlineId),
    byRarity: (skin: AppDataSkin) => !query.rarity || skin.rarity === query.rarity,
    byChromaExistence: (skin: AppDataSkin) => {
      if (query.hasChroma === "true") return !!skin.chromas.length;
      return query.hasChroma === "false" ? !skin.chromas.length : true;
    },
    byChroma: (skin: AppDataSkin) => {
      if (!query.chromaId || !chroma) return true;
      return skin.chromas.some((skinChroma) => isEqual(skinChroma.colors, chroma.colors) && skinChroma.name === chroma.name);
    },
    byLegacy: (skin: AppDataSkin) => {
      if (query.legacy === "all") return true;
      return query.legacy === "on" ? skin.isLegacy : !skin.isLegacy;
    },
    byOwned: (skin: AppDataSkin) => {
      if (!user || query.owned === "all") return true;
      return query.owned === "on" ? user.owned_skins.includes(skin.contentId) : !user.owned_skins.includes(skin.contentId);
    },
    byServer: (skin: AppDataSkin) => {
      if (query.server === "latest") return skin.pbe === false;
      if (query.server === "pbe") return skin.pbe === true;
      return true;
    },
  };

  return (skin: AppDataSkin) => Object.values(filters).every((filter) => filter(skin));
};
