import { fetchRiot } from "@/lib/fetchRiot";
import { progressLog } from "@/lib/riotProgress";
import { dDragonUrl } from "@/shared/constants/riot";

export const getLanguages = async () => {
  try {
    const url = `${dDragonUrl}/cdn/languages.json`;
    const data = await fetchRiot(url);
    return data;
  } catch (error) {
    progressLog.error("[ERROR][getLanguages]", (error as any).message);
  }
};
