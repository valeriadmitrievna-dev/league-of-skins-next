import type { I18nConfig } from "next-i18next/proxy";

const i18nConfig: I18nConfig = {
  supportedLngs: ["en", "ru"],
  fallbackLng: "en",
  // defaultNS: "common",
  // ns: ["common", "home"],
  resourceLoader: (language) => import(`./locales/${language}.locale.json`),
};

export default i18nConfig;
