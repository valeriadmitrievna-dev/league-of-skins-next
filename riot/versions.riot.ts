import { fetchRiot } from "@/lib/fetchRiot";
import { progressLog } from "@/lib/riotProgress";
import { dDragonUrl } from "@/shared/constants/riot";

export const getVersions = async (lang: string) => {
  try {
    const url = `${dDragonUrl}/api/versions.json`;
    const data = await fetchRiot(url);
    return data;
  } catch (error) {
    progressLog.error("[ERROR][getVersions]", (error as any).message);
  }
};
