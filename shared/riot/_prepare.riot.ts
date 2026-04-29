import { uniqBy } from "lodash";
import { cDragonUrl, dDragonUrl } from "@/shared/constants/riot";
import { getCDragonPath } from "@/shared/utils/getCDragonPath";
import { LangProgress } from "@/widgets/Logs/types";
import { getVersions } from "@/riot/versions.riot";
import { getSkinlines } from "@/riot/skinlines.riot";
import { getChampions } from "@/riot/champions.riot";
import { config } from "@/lib/config";
import { getChampion } from "@/riot/champion.riot";

const fetchRiot = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      "Alt-Used": "",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
};

export type ProgressCallback = (message: string, type?: "default" | "success" | "error") => void;
export type LangProgressCallback = (lang: string, update: Partial<LangProgress>) => void;

export const prepareRiotClient = async (
  languages: string[],
  onProgress: ProgressCallback,
  onLangUpdate: LangProgressCallback,
) => {
  onProgress("PREPARE START");

  for (const lang of languages) {
    onLangUpdate(lang, {
      status: "loading",
      categories: { versions: "idle", skinlines: "idle", champions: "idle", skins: "idle", chromas: "idle" },
    });
    try {
      onProgress(`[${lang}] Start loading`);

      // versions
      onProgress(`[${lang}] Get versions...`);
      onLangUpdate(lang, { categories: { versions: "loading" } });
      const versions = await getVersions();

      if (!versions?.length) {
        onProgress(`[${lang}] Versions: ERROR`, "error");
        onLangUpdate(lang, { categories: { versions: "error" } });
        continue;
      }

      onProgress(`[${lang}] Versions: [${versions.slice(0, 3).join(", ")}...]`, "success");
      onLangUpdate(lang, { categories: { versions: "done" } });

      // skinlines
      onProgress(`[${lang}] Get skinlines...`);
      onLangUpdate(lang, { categories: { skinlines: "loading" } });
      const skinlines_latest = await getSkinlines(lang, "latest");
      const skinlines_pbe = await getSkinlines(lang, "pbe");
      const skinlines = uniqBy([...(skinlines_latest ?? []), ...(skinlines_pbe ?? [])], "id");

      if (!skinlines?.length) {
        onProgress(`[${lang}] Skinlines: ERROR`, "error");
        onLangUpdate(lang, { categories: { skinlines: "error" } });
        continue;
      }

      onProgress(`[${lang}] Skinlines: ${skinlines.length}`, "success");
      onLangUpdate(lang, { categories: { skinlines: "done" } });

      // champions
      onProgress(`[${lang}] Get champions...`);
      onLangUpdate(lang, { categories: { champions: "loading" } });
      const riot_champions = await getChampions(versions[0] ?? config.riotVersion, lang);

      if (!riot_champions?.length) {
        onProgress(`[${lang}] Champions: ERROR`, "error");
        onLangUpdate(lang, { categories: { champions: "error" } });
        continue;
      }

      onProgress(`[${lang}] Champions: ${riot_champions.length}`, "success");
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

      const skins: any[] = [];
      const chromas: any[] = [];

      // champion skins
      for (const champion of champions) {
        const champion_data = await getChampion(champion.key, lang, "latest");
        const champion_data_pbe = await getChampion(champion.key, lang, "pbe");

        if (!champion_data) {
          onProgress(`[${lang}] ${champion.name}`, "error");
          onLangUpdate(lang, { categories: { champions: "error" } });
          break;
        }

        const champion_skins_live = champion_data.skins.filter((s: any) => !s.isBase).map((s: any) => s.contentId);

        const source_skins = champion_data_pbe
          ? champion_data_pbe.skins.filter((s: any) => !s.isBase)
          : champion_data.skins.filter((s: any) => !s.isBase);

        onLangUpdate(lang, { categories: { skins: "loading", chromas: "loading" } });
        for (const skin of source_skins) {
          const pbe = champion_data_pbe ? !champion_skins_live.includes(skin.contentId) : false;

          const skinChromas = (skin.chromas ?? []).map((chroma: any) => {
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
              .map((sl: any) => {
                const found = skinlines.find((s: any) => s.id === sl.id);
                return found ? { id: String(sl.id), name: found.name } : null;
              })
              .filter(Boolean),
          });
        }

        onLangUpdate(lang, { categories: { skins: "done", chromas: "done" } });
        onProgress(`[${lang}] ${champion.name}`, "success");
      }

      // отправляем на сервер
      onProgress(`[${lang}] Saving...`);
      await fetch("/api/riot-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          data: { champions, skinlines, skins, chromas },
        }),
      });

      onProgress(`[${lang}] Done`, "success");
      onLangUpdate(lang, { status: "done" });
    } catch (error) {
      onProgress(`[${lang}] ERROR: ${(error as Error).message}`, "error");
      onLangUpdate(lang, { status: "error" });
    }
  }

  onProgress("PREPARE END", "success");
};
