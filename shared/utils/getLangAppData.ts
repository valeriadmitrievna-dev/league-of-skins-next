import { RequestError } from '@/errors';
import { readJsonFile } from './getFileData';
import { baseFolder } from '../constants/riot';

const cache = new Map<string, any>();

export const getLangAppData = async (lang: string = 'en_US') => {
  if (cache.has(lang)) return cache.get(lang)!;
  
  try {
    const data = await readJsonFile<any>(`${baseFolder}/${lang}.json`);
    cache.set(lang, data);
    return data;
  } catch {
    throw new RequestError({ code: 'ERR_0003' });
  }
};

export const clearAppDataCache = () => cache.clear();