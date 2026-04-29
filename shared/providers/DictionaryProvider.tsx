"use client";
import { createContext, PropsWithChildren, useContext } from "react";
import type { Dictionary } from "@/lib/i18n";

interface ContextValue {
  dictionary: Dictionary;
  locale: string;
}

const DictionaryContext = createContext<ContextValue | null>(null);

export const DictionaryProvider = ({ children, dictionary, locale }: PropsWithChildren<ContextValue>) => (
  <DictionaryContext.Provider value={{ dictionary, locale }}>{children}</DictionaryContext.Provider>
);

export const useDictionary = (): Dictionary => {
  const ctx = useContext(DictionaryContext);
  if (!ctx) throw new Error("useDictionary must be used within DictionaryProvider");
  return ctx.dictionary;
};

export const useLocale = (): string => {
  const ctx = useContext(DictionaryContext);
  if (!ctx) throw new Error("useLocale must be used within DictionaryProvider");
  return ctx.locale;
};
