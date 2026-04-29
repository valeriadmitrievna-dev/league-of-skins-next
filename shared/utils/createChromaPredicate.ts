import { IUser } from '../schemas/user.schema';
import { SearchChromasRequest } from '../types';
import { checkSearch } from './checkSearch';
import { LocalChroma } from '../models/chroma.model';

export const createChromaPredicate = (query: SearchChromasRequest, user: IUser | null) => {
  query.owned ??= 'all';
  query.skin ??= 'all';

  const filters = {
    byChampionId: (chroma: LocalChroma) => !query.championId || chroma.championId === query.championId,
    bySkinContentIdId: (chroma: LocalChroma) => !query.skinContentId || chroma.skinContentId === query.skinContentId,
    bySearch: (chroma: LocalChroma) => !query.search || checkSearch(chroma.name, query.search),
    byOwned: (chroma: LocalChroma) => {
      if (!user || query.owned === 'all') return true;
      return query.owned === 'on' ? user.ownedChromas.includes(chroma.contentId) : !user.ownedChromas.includes(chroma.contentId);
    },
    bySkin: (chroma: LocalChroma) => {
      if (!user || query.skin === 'all') return true;
      return query.skin === 'on' ? user.ownedSkins.includes(chroma.skinContentId) : !user.ownedSkins.includes(chroma.skinContentId);
    },
    byServer: (chroma: LocalChroma) => {
      if (query.server === 'latest') return chroma.pbe === false;
      if (query.server === 'pbe') return chroma.pbe === true;
      return true;
    },
  };

  return (chroma: LocalChroma) => Object.values(filters).every((filter) => filter(chroma));
};
