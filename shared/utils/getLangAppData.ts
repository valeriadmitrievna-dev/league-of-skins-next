import { RequestError } from "@/errors";
import { AppDataLang } from "@/types/appdata";

import { readJsonFile } from "./getFileData";
import { baseFolder } from "../constants/riot";

const cache = new Map<string, unknown>();
const inflight = new Map<string, Promise<AppDataLang>>();

export const getLangAppData = async (lang: string = "en_US"): Promise<AppDataLang> => {
  if (cache.has(lang)) return cache.get(lang) as AppDataLang;

  if (inflight.has(lang)) return inflight.get(lang)!;

  const promise = readJsonFile<AppDataLang>(`${baseFolder}/${lang}.json`)
    .then((data) => {
      if (!data) throw new RequestError({ code: "ERR_0003", status: 404 });
      cache.set(lang, data);
      inflight.delete(lang);
      return data;
    })
    .catch((err) => {
      inflight.delete(lang);
      throw err;
    });

  inflight.set(lang, promise);
  return promise;
};

export const clearAppDataCache = (lang?: string) => {
  if (lang) {
    cache.delete(lang);
  } else {
    cache.clear();
  }
};
