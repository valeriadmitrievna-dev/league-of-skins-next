import { uniqBy } from "lodash";
import { cDragonUrl, dDragonUrl } from "@/shared/constants/riot";
import { getCDragonPath } from "@/shared/utils/getCDragonPath";
import { getVersions } from "@/riot/versions.riot";
import { getSkinlines } from "@/riot/skinlines.riot";
import { getChampions } from "@/riot/champions.riot";
import { config } from "@/lib/config";
import { getChampion } from "@/riot/champion.riot";
import { LangProgress } from "./types";
import { AppDataChroma, AppDataSkin } from "@/types/appdata";

export type ProgressCallback = (message: string, type?: "default" | "success" | "error") => void;
export type LangProgressCallback = (lang: string, update: Partial<LangProgress>) => void;

export const prepareRiotClient = async (languages: string[], logger: any, onLangUpdate: LangProgressCallback) => {
  logger.log("PREPARE START");

  for (const lang of languages) {
    const timeStart = performance.now();
    onLangUpdate(lang, {
      status: "loading",
      categories: { versions: "idle", skinlines: "idle", champions: "idle", skins: "idle", chromas: "idle" },
    });
    try {
      logger.log(`[${lang}] Start loading`);

      // versions
      logger.log(`[${lang}] Get versions...`);
      onLangUpdate(lang, { categories: { versions: "loading" } });
      const versions = await getVersions();

      if (!versions?.length) {
        logger.error(`[${lang}] Versions: ERROR`);
        onLangUpdate(lang, { categories: { versions: "error" } });
        continue;
      }

      logger.success(`[${lang}] Versions: [${versions.slice(0, 3).join(", ")}...]`);
      onLangUpdate(lang, { categories: { versions: "done" } });

      // skinlines
      logger.log(`[${lang}] Get skinlines...`);
      onLangUpdate(lang, { categories: { skinlines: "loading" } });
      const skinlines_latest = await getSkinlines(lang, "latest");
      const skinlines_pbe = await getSkinlines(lang, "pbe");
      const skinlines = uniqBy([...(skinlines_latest ?? []), ...(skinlines_pbe ?? [])], "id");

      if (!skinlines?.length) {
        logger.error(`[${lang}] Skinlines: ERROR`);
        onLangUpdate(lang, { categories: { skinlines: "error" } });
        continue;
      }

      logger.success(`[${lang}] Skinlines: ${skinlines.length}`);
      onLangUpdate(lang, { categories: { skinlines: "done" } });

      // champions
      logger.log(`[${lang}] Get champions...`);
      onLangUpdate(lang, { categories: { champions: "loading" } });
      const riot_champions = await getChampions(versions[0] ?? config.riotVersion, lang);

      if (!riot_champions?.length) {
        logger.error(`[${lang}] Champions: ERROR`);
        onLangUpdate(lang, { categories: { champions: "error" } });
        continue;
      }

      logger.success(`[${lang}] Champions: ${riot_champions.length}`);
      onLangUpdate(lang, { categories: { champions: "done" } });

      const champions = riot_champions.map((c) => ({
        id: String(c.id),
        key: c.key,
        name: c.name,
        image: {
          full: `${dDragonUrl}/cdn/img/champion/splash/${c.id}_0.jpg`,
          loading: `${dDragonUrl}/cdn/img/champion/loading/${c.id}_0.jpg`,
          icon: `${cDragonUrl}/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${c.key}.png`,
        },
      }));

      const skins: AppDataSkin[] = [];
      const chromas: AppDataChroma[] = [];

      // champion skins
      for (const champion of champions) {
        const champion_data = await getChampion(champion.key, lang, "latest");
        const champion_data_pbe = await getChampion(champion.key, lang, "pbe");

        if (!champion_data) {
          logger.error(`[${lang}] ${champion.name}`);
          onLangUpdate(lang, { categories: { champions: "error" } });
          break;
        }

        const champion_skins_live = champion_data.skins.filter((s) => !s.isBase).map((s) => s.contentId);

        const source_skins = champion_data_pbe
          ? champion_data_pbe.skins.filter((s) => !s.isBase)
          : champion_data.skins.filter((s) => !s.isBase);

        onLangUpdate(lang, { categories: { skins: "loading", chromas: "loading" } });
        for (const skin of source_skins) {
          const pbe = champion_data_pbe ? !champion_skins_live.includes(skin.contentId) : false;

          const skinChromas = (skin.chromas ?? []).map((chroma) => {
            const regex = /.*\(([^)]+)\)/;
            const match = chroma.name.match(regex);
            const chromaRuName = chroma.name.split("'")[chroma.name.split("'").length - 3];
            const chromaName = lang === "ru_RU" ? chromaRuName : (match?.[1] ?? chroma.name);

            return {
              id: String(chroma.id),
              name: chromaName,
              fullName: chroma.name,
              contentId: chroma.contentId,
              skinName: skin.name,
              skinContentId: skin.contentId,
              championId: champion_data.alias,
              path: getCDragonPath(chroma.chromaPath, pbe ? "pbe" : "latest"),
              colors: [...new Set(chroma.colors)],
              pbe,
            };
          });

          chromas.push(...skinChromas);

          skins.push({
            id: String(skin.id),
            isLegacy: !!skin.isLegacy,
            contentId: skin.contentId,
            championId: champion.id,
            championKey: champion.key,
            championName: champion.name,
            name: skin.name,
            description: skin.description,
            pbe,
            image: {
              centered: getCDragonPath(skin.splashPath, pbe ? "pbe" : "latest"),
              uncentered: getCDragonPath(skin.uncenteredSplashPath, pbe ? "pbe" : "latest"),
              loading: getCDragonPath(skin.loadScreenPath, pbe ? "pbe" : "latest"),
            },
            rarity: skin.rarity,
            chromaPath: getCDragonPath(skin.chromaPath, pbe ? "pbe" : "latest"),
            chromas: skinChromas,
            skinlines: (skin.skinLines ?? [])
              .map((sl) => {
                const found = skinlines.find((s) => s.id === sl.id);
                return found ? { id: String(sl.id), name: found.name } : null;
              })
              .filter((s) => !!s),
          });
        }

        onLangUpdate(lang, { categories: { skins: "done", chromas: "done" } });
      }

      logger.success(`[${lang}] Skins: ${skins.length}`);
      logger.success(`[${lang}] Chromas: ${chromas.length}`);

      // отправляем на сервер
      logger.log(`[${lang}] Saving...`);
      await fetch("/api/riot-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          data: { champions, skinlines, skins, chromas },
        }),
      });

      logger.success(`[${lang}] Done`);
      onLangUpdate(lang, { status: "done", lastUpdate: String(new Date()) });
    } catch (error) {
      logger.error(`[${lang}] ERROR: ${(error as Error).message}`);
      onLangUpdate(lang, { status: "error" });
    }

    const timeSeconds = Math.round(performance.now() - timeStart) / 1000;
    onLangUpdate(lang, { timeSeconds });
  }
  logger.log("PREPARE END");
};
