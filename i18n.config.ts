import type { I18nConfig } from "next-i18next/proxy";

const i18nConfig: I18nConfig = {
  supportedLngs: ["en", "ru"],
  fallbackLng: "en",
  localeInPath: false,
  defaultNS: "common",
  ns: ["common", "errors"],
  resourceLoader: (language, namespace) => import(`./public/locales/${language}/${namespace}.json`),
};

export default i18nConfig;
