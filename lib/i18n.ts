import { cookies } from "next/headers";
import en from "@/i18n/locales/en.locale.json";
import ru from "@/i18n/locales/ru.locale.json";

export interface LocaleTypes {
  [componentName: string]: {
    [field: string]: string;
  };
}

export type Locale = "en" | "ru";
export type Dictionary = LocaleTypes;

const dictionaries = { en, ru };

export const getDictionary = async () => {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("language")?.value ?? "en") as Locale;
  return dictionaries[lang] ?? dictionaries.en;
};

export const getLocale = async (): Promise<Locale> => {
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value ?? "en";
  return (lang === "ru" ? "ru" : "en") as Locale;
};
