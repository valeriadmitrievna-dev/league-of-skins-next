import { dDragonUrl } from "@/shared/constants/riot";

export const getVersions = async () => {
  try {
    const url = `${dDragonUrl}/api/versions.json`;
    const res = await fetch(url);
    const data: string[] = await res.json();
    return data;
  } catch (error) {
    console.error("[ERROR][getVersions]", (error as Error).message);
  }
};
