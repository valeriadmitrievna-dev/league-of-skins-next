import { AppDataPrice } from '@/types/appdata';

import { readDirectory } from "./getFileData";
import { baseFolder } from "../constants/riot";

export const getPrices = async (): Promise<AppDataPrice[]> => {
  try {
    const dataRaw = await readDirectory(`${baseFolder}`);
    const prices = JSON.parse(dataRaw["_prices.json"]) as AppDataPrice[];
    return prices;
  } catch {
    return [];
  }
};
