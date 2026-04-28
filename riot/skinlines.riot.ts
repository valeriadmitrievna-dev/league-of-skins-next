import { fetchRiot } from '@/lib/fetchRiot';
import { progressLog } from "@/lib/riotProgress";
import { cDragonUrl } from "@/shared/constants/riot";

export const getSkinlines = async (lang: string = "default", server: "latest" | "pbe" = "latest") => {
  lang = lang.toLowerCase();
  const language = lang === "en_us" ? "default" : lang;
  const url = `${cDragonUrl}/${server}/plugins/rcp-be-lol-game-data/global/${language}/v1/skinlines.json`;

  try {
    const data = await fetchRiot(url);
    return data;
  } catch (error) {
    progressLog.error(`[ERROR][getSkinlines][${server}]`, url);
    progressLog.error(`[ERROR][getSkinlines][${server}]`, (error as any).message);
  }
};
