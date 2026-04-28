import { progressLog } from '@/lib/riotProgress';
import { mkdirSync, writeFileSync } from 'fs';
import { readdir, readFile } from 'fs/promises';
import { dirname } from 'path';

export const readDirectory = async (dirpath: string): Promise<Record<string, string>> => {
  try {
    const filenames = await readdir(dirpath);
    const result: Record<string, string> = {};

    for (const filename of filenames) {
      const fullPath = `${dirpath}/${filename}`;
      const content = await readFile(fullPath, 'utf-8');
      result[filename] = content;
    }

    return result;
  } catch (error) {
    progressLog('[ERROR] DIRECTORY READ FAILED ->', (error as any).message);
    return {};
  }
};

export const readFileText = async (filepath: string): Promise<string> => {
  try {
    return await readFile(filepath, 'utf-8');
  } catch (error) {
    progressLog('[ERROR] FILE READ FAILED ->', (error as any).message);
    throw error;
  }
};

export const readJsonFile = async <T>(filepath: string, defaultValue?: T): Promise<T> => {
  try {
    const text = await readFileText(filepath);
    return JSON.parse(text) as T;
  } catch (error) {
    return defaultValue ?? ({} as T);
  }
};

export const saveToJson = async <T>(path: string, data: T) => {
  try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify(data), 'utf-8');
  } catch (error) {
    progressLog('[ERROR]', '[saveToJson]', (error as any).message);
  }
};
