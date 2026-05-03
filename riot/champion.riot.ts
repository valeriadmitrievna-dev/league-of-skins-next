import { cDragonUrl } from '@/shared/constants/riot';
import { RiotChampion } from '@/types/riot';

export const getChampion = async (championKey: string, lang: string = 'default', server: 'latest' | 'pbe' = 'latest') => {
  lang = lang.toLowerCase();
  const language = lang === 'en_us' ? 'default' : lang;
  const url = `${cDragonUrl}/${server}/plugins/rcp-be-lol-game-data/global/${language}/v1/champions/${championKey}.json`;

  try {
    const res = await fetch(url);
    const data: RiotChampion = await res.json();
    return data;
  } catch (error) {
    console.error(`[ERROR][getChampion][${server}]`, url);
    console.error(`[ERROR][getChampion][${server}]`, (error as Error).message);
  }
};
