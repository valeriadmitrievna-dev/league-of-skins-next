import { SearchChromasRequest } from '@/api/types';
import { AppDataChroma } from '@/types/appdata';
import { DbUser } from '@/types/db';

import { checkSearch } from './checkSearch';

export const createChromaPredicate = (query: SearchChromasRequest, user: DbUser | null) => {
  query.owned ??= 'all';
  query.skin ??= 'all';

  const filters = {
    byChampionId: (chroma: AppDataChroma) => !query.championId || chroma.championId === query.championId,
    bySkinContentIdId: (chroma: AppDataChroma) => !query.skinContentId || chroma.skinContentId === query.skinContentId,
    bySearch: (chroma: AppDataChroma) => !query.search || checkSearch(chroma.name, query.search),
    byOwned: (chroma: AppDataChroma) => {
      if (!user || query.owned === 'all') return true;
      return query.owned === 'on' ? user.owned_chromas.includes(chroma.contentId) : !user.owned_chromas.includes(chroma.contentId);
    },
    bySkin: (chroma: AppDataChroma) => {
      if (!user || query.skin === 'all') return true;
      return query.skin === 'on' ? user.owned_skins.includes(chroma.skinContentId) : !user.owned_skins.includes(chroma.skinContentId);
    },
    byServer: (chroma: AppDataChroma) => {
      if (query.server === 'latest') return chroma.pbe === false;
      if (query.server === 'pbe') return chroma.pbe === true;
      return true;
    },
  };

  return (chroma: AppDataChroma) => Object.values(filters).every((filter) => filter(chroma));
};
