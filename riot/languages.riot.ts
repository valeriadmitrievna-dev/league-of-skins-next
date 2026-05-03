import { dDragonUrl } from "@/shared/constants/riot";

export const getLanguages = async () => {
  try {
    const url = `${dDragonUrl}/cdn/languages.json`;
    const res = await fetch(url);
    const data: string[] = await res.json();
    return data;
  } catch (error) {
    console.error("[ERROR][getLanguages]", (error as Error).message);
  }
};
