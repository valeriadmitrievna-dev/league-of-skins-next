import { dDragonUrl } from "@/shared/constants/riot";
import { RiotChampionItem } from '@/types/riot';

export const getChampions = async (version: string, lang: string = "en_US") => {
  try {
    const url = `${dDragonUrl}/cdn/${version}/data/${lang}/champion.json`;
    const res = await fetch(url);
    const data = await res.json();
    const champions: RiotChampionItem[] = Object.values(data.data);
    return champions;
  } catch (error) {
    console.error("[ERROR][getChampions]", (error as Error).message);
  }
};
