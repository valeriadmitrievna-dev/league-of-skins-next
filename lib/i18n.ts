import en from "@/locales/en.locale.json";
import ru from "@/locales/ru.locale.json";

export interface LocaleTypes {
  [componentName: string]: {
    [field: string]: string;
  };
}

export type Locale = "en" | "ru";
export type Dictionary = LocaleTypes;

const dictionaries = { en, ru };

export const getDictionary = async (lang: string) => {
  return dictionaries[lang as keyof typeof dictionaries] ?? dictionaries.en;
};
