import { SearchChromasRequest } from '@/api/types';
import { AppDataChroma } from '@/types/appdata';

import { checkSearch } from './checkSearch';

export const createChromaPredicate = (query: SearchChromasRequest, ownedChromaIds: Set<string> | null, ownedSkinIds: Set<string> | null) => {
  query.owned ??= "all";
  query.skin ??= "all";

  const filters = {
    byChampionId: (chroma: AppDataChroma) => !query.championId || chroma.championId === query.championId,
    bySkinContentId: (chroma: AppDataChroma) => !query.skinContentId || chroma.skinContentId === query.skinContentId,
    bySearch: (chroma: AppDataChroma) => !query.search || checkSearch(chroma.name, query.search),
    byOwned: (chroma: AppDataChroma) => {
      if (!ownedChromaIds || query.owned === "all") return true;
      return query.owned === "on" ? ownedChromaIds.has(chroma.contentId) : !ownedChromaIds.has(chroma.contentId);
    },
    bySkin: (chroma: AppDataChroma) => {
      if (!ownedSkinIds || query.skin === "all") return true;
      return query.skin === "on" ? ownedSkinIds.has(chroma.skinContentId) : !ownedSkinIds.has(chroma.skinContentId);
    },
    byServer: (chroma: AppDataChroma) => {
      if (query.server === "latest") return chroma.pbe === false;
      if (query.server === "pbe") return chroma.pbe === true;
      return true;
    },
  };

  return (chroma: AppDataChroma) => Object.values(filters).every((filter) => filter(chroma));
};
