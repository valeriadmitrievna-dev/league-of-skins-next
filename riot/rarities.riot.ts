import { progressLog, setCategoryStatus } from '@/lib/riotProgress';
import { getLangAppData } from '@/shared/api/utils/getLangAppData';

export const getRarities = async () => {
  try {
    const data = await getLangAppData();

    if (data) {
      const rarities = [...new Set(data.skins.map((skin) => skin.rarity))];
      return rarities;
    }
  } catch (error) {
    progressLog('[ERROR][getRarities]', (error as any).message);
  }
};