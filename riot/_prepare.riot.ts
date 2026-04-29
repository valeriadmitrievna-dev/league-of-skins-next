// _prepare.riot.ts
import { differenceInDays } from "date-fns";
import { clearAppDataCache, getLangAppData } from "@/shared/utils/getLangAppData";
import { config } from "@/lib/config";
import { saveToJson } from "@/shared/utils/getFileData";
import { getFullDataRiot } from "./_fulldata.riot";
import { setGlobalStatus, setLangStatus, progressLog, initLang, resetProgress } from "@/lib/riotProgress";
import { getLanguages } from "./languages.riot";

export const prepareRiot = async (forceLanguages: string[] = []) => {
  resetProgress();

  try {
    const updateDate = new Date();
    setGlobalStatus("running");
    progressLog.default("PREPARE START");

    const languages = await getLanguages();
    const dev_languages = ["en_US"];

    if (languages) {
      progressLog.default(`Languages: [${languages.slice(0, 3).join(", ")}${languages.length > 3 ? ", ..." : ""}]`);
    } else {
      setGlobalStatus("error");
      return;
    }

    for await (const language of dev_languages) {
      initLang(language);

      const loadLangStart = performance.now();

      const langData = await getLangAppData(language);
      const lastUpdateDiff = differenceInDays(new Date(), new Date(langData?.updated));

      // if (langData && lastUpdateDiff < config.dataUpdateDays && !forceLanguages.includes(language)) {
      //   setLangStatus(language, "skipped");
      //   progressLog.default(`${language} skipped (up to date)`);
      //   continue;
      // }

      setLangStatus(language, "loading");
      progressLog.default(`[${language}] Start loading`);

      const dataByLang = await getFullDataRiot(language);

      if (!dataByLang) {
        setLangStatus(language, "error");
        continue;
      }

      clearAppDataCache();
      saveToJson(`${baseFolder}/${language}.json`, { lang: language, updated: new Date(), ...dataByLang });
      const timeSeconds = Math.round(performance.now() - loadLangStart) / 1000;
      setLangStatus(language, "done", { timeSeconds });
      progressLog.success(`${language} done [${timeSeconds}s] — ${1} skins`);
    }

    // for await (const language of ["ru_RU", "en_US"]) {
    //   initLang(language);
    //   const loadLangStart = performance.now();
    //   const langData = await getLangAppData(language);
    //   const lastUpdateDiff = differenceInDays(new Date(), new Date(langData?.updated));

    //   if (langData && lastUpdateDiff < config.dataUpdateDays && !forceLanguages.includes(language)) {
    //     setLangStatus(language, "skipped");
    //     progressLog(`${language} skipped (up to date)`);
    //     continue;
    //   }

    //   setLangStatus(language, "loading");
    //   progressLog(`${language} loading...`);

    //   const dataByLang = await getFullDataRiot(language);
    //   const data = { lang: language, updated: updateDate, ...dataByLang };

    //   clearAppDataCache();
    //   saveToJson(`${baseFolder}/${language}.json`, data);

    //   const timeSeconds = Math.round(performance.now() - loadLangStart) / 1000;
    //   setLangStatus(language, "done", {
    //     timeSeconds,
    //     skinsCount: dataByLang.skins.length,
    //     chromasCount: dataByLang.chromas.length,
    //     championsCount: dataByLang.champions.length,
    //   });
    //   progressLog(`${language} done [${timeSeconds}s] — ${dataByLang.skins.length} skins`);
    // }

    setGlobalStatus("done");
    progressLog.default("PREPARE END");
  } catch (error) {
    setGlobalStatus("error");
    progressLog.error(`ERROR: ${(error as Error).message}`);
  }
};
