import { getLangAppData } from "@/shared/utils/getLangAppData";

export const getRarities = async () => {
  try {
    const data = await getLangAppData();

    if (data) {
      const rarities = [...new Set(data.skins.map((skin) => skin.rarity))];
      return rarities;
    }
  } catch (error) {
    console.error("[ERROR][getRarities]", (error as Error).message);
  }
};
