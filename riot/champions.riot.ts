import { fetchRiot } from "@/lib/fetchRiot";
import { progressLog } from "@/lib/riotProgress";
import { dDragonUrl } from "@/shared/constants/riot";

export const getChampions = async (version: string, lang: string = "en_US") => {
  try {
    const url = `${dDragonUrl}/cdn/${version}/data/${lang}/champion.json`;
    const { data } = await fetchRiot(url);
    const champions: any[] = Object.values(data);
    return champions;
  } catch (error) {
    progressLog.error("[ERROR][getChampions]", (error as any).message);
  }
};
