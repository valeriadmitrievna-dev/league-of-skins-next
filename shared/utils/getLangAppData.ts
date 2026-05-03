import { RequestError } from "@/errors";
import { readJsonFile } from "./getFileData";
import { baseFolder } from "../constants/riot";
import { AppDataLang } from '@/types/appdata';

// В Next.js dev-режиме модуль может переинициализироваться при HMR,
// но в prod воркеры не шарят память между собой.
// Кэш здесь — только per-process оптимизация (убирает повторные readFile
// в рамках одного запроса / одного воркера).
// Не полагайся на него как на source of truth между запросами.
const cache = new Map<string, unknown>();

export const getLangAppData = async (lang: string = "en_US"): Promise<AppDataLang> => {
  if (cache.has(lang)) return cache.get(lang) as AppDataLang;

  const data = await readJsonFile<AppDataLang>(`${baseFolder}/${lang}.json`);

  if (!data) {
    throw new RequestError({ code: "ERR_0003", status: 404 });
  }

  cache.set(lang, data);
  return data;
};

export const clearAppDataCache = (lang?: string) => {
  if (lang) {
    cache.delete(lang);
  } else {
    cache.clear();
  }
};
