import { AppDataSale } from '@/types/appdata';

import { readDirectory } from "./getFileData";
import { baseFolder } from "../constants/riot";

export const getSales = async (): Promise<AppDataSale[]> => {
  try {
    const dataRaw = await readDirectory(`${baseFolder}`);
    const sales = JSON.parse(dataRaw['_sales.json']) as AppDataSale[];
    return sales;
  } catch {
    return [];
  }
};
