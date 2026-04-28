import { dDragonUrl } from "@/shared/constants/riot";

export const getVersions = async (lang: string) => {
  try {
    const url = `${dDragonUrl}/api/versions.json`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("[ERROR][getVersions]", (error as any).message);
  }
};
