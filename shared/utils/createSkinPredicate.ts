import { isEqual } from "lodash";
import { getLangAppData } from "./getLangAppData";
import { checkSearch } from "./checkSearch";

type LocalSkin = any;

export const createSkinPredicate = async (query: any, user: any | null, lang: string) => {
  const chromas = ((await getLangAppData(lang)) as any)?.chromas || [];
  const chroma = chromas?.find((chroma: any) => chroma.id.toString() === query.chromaId?.toString());

  const filters = {
    byChampionId: (skin: LocalSkin) => !query.championId || skin.championId === query.championId,
    bySearch: (skin: LocalSkin) => !query.search || checkSearch(skin.name, query.search),
    bySkinline: (skin: LocalSkin) => !query.skinlineId || skin.skinlines.some((s: any) => s.id.toString() === query.skinlineId),
    byRarity: (skin: LocalSkin) => !query.rarity || skin.rarity === query.rarity,
    byChromaExistence: (skin: LocalSkin) => {
      if (query.hasChroma === "true") return !!skin.chromas.length;
      return query.hasChroma === "false" ? !skin.chromas.length : true;
    },
    byChroma: (skin: LocalSkin) => {
      if (!query.chromaId || !chroma) return true;
      return skin.chromas.some((skinChroma: any) => isEqual(skinChroma.colors, chroma.colors) && skinChroma.name === chroma.name);
    },
    byLegacy: (skin: LocalSkin) => {
      if (query.legacy === "all") return true;
      return query.legacy === "on" ? skin.isLegacy : !skin.isLegacy;
    },
    byOwned: (skin: LocalSkin) => {
      if (!user || query.owned === "all") return true;
      return query.owned === "on" ? user.ownedSkins.includes(skin.contentId) : !user.ownedSkins.includes(skin.contentId);
    },
    byServer: (skin: LocalSkin) => {
      if (query.server === "latest") return skin.pbe === false;
      if (query.server === "pbe") return skin.pbe === true;
      return true;
    },
  };

  return (skin: LocalSkin) => Object.values(filters).every((filter) => filter(skin));
};
