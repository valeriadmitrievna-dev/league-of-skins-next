import { uniqBy } from "lodash";
import { cDragonUrl, dDragonUrl } from "@/shared/constants/riot";
import { getCDragonPath } from "@/shared/api/utils/getCDragonPath";
import { LangProgress } from "@/lib/riotProgress";

const fetchRiot = async (url: string) => {
  const res = await fetch(url);
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
      onProgress(`[${lang}] Get versions`);
      onLangUpdate(lang, { categories: { versions: "loading" } });
      const versions: string[] = await fetchRiot(`${dDragonUrl}/api/versions.json`);
      onProgress(`[${lang}] Versions: [${versions.slice(0, 3).join(", ")}...]`);
      onLangUpdate(lang, { categories: { versions: "done" } });

      const langLower = lang.toLowerCase();
      const langCDragon = langLower === "en_us" ? "default" : langLower;

      // skinlines
      onProgress(`[${lang}] Get skinlines`);
      onLangUpdate(lang, { categories: { skinlines: "loading" } });
      const skinlines_latest = await fetchRiot(
        `${cDragonUrl}/latest/plugins/rcp-be-lol-game-data/global/${langCDragon}/v1/skinlines.json`,
      );
      const skinlines_pbe = await fetchRiot(
        `${cDragonUrl}/pbe/plugins/rcp-be-lol-game-data/global/${langCDragon}/v1/skinlines.json`,
      ).catch(() => []);
      const skinlines = uniqBy([...skinlines_latest, ...skinlines_pbe], "id");
      onProgress(`[${lang}] Skinlines: ${skinlines.length}`, "success");
      onLangUpdate(lang, { categories: { skinlines: "done" } });

      // champions
      onProgress(`[${lang}] Get champions`);
      onLangUpdate(lang, { categories: { champions: "loading" } });
      const { data: championsRaw } = await fetchRiot(`${dDragonUrl}/cdn/${versions[0]}/data/${lang}/champion.json`);
      const riot_champions: any[] = Object.values(championsRaw);
      onProgress(`[${lang}] Champions: ${riot_champions.length}`, "success");
      onProgress(`[${lang}] Get champions`);
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
      //   for (const champion of champions) {
      //     onProgress(`[${lang}] Champion: ${champion.name}`)

      //     const champion_data = await fetchRiot(`${cDragonUrl}/latest/plugins/rcp-be-lol-game-data/global/${langCDragon}/v1/champions/${champion.key}.json`).catch(() => null)
      //     const champion_data_pbe = await fetchRiot(`${cDragonUrl}/pbe/plugins/rcp-be-lol-game-data/global/${langCDragon}/v1/champions/${champion.key}.json`).catch(() => null)

      //     if (!champion_data) continue

      //     const champion_skins_live = champion_data.skins.filter((s: any) => !s.isBase).map((s: any) => s.contentId)

      //     const source_skins = champion_data_pbe
      //       ? champion_data_pbe.skins.filter((s: any) => !s.isBase)
      //       : champion_data.skins.filter((s: any) => !s.isBase)

      //     for (const skin of source_skins) {
      //       const pbe = champion_data_pbe ? !champion_skins_live.includes(skin.contentId) : false

      //       const skinChromas = (skin.chromas ?? []).map((chroma: any) => {
      //         const regex = /.*\(([^)]+)\)/
      //         const match = chroma.name.match(regex)
      //         const chromaRuName = chroma.name.split("'")[chroma.name.split("'").length - 3]
      //         const chromaName = lang === 'ru_RU' ? chromaRuName : (match?.[1] ?? chroma.name)

      //         return {
      //           id: String(chroma.id),
      //           name: chromaName,
      //           fullName: chroma.name,
      //           contentId: chroma.contentId,
      //           skinName: skin.name,
      //           skinContentId: skin.contentId,
      //           championId: champion_data.alias,
      //           path: getCDragonPath(chroma.chromaPath, pbe ? 'pbe' : 'latest'),
      //           colors: [...new Set(chroma.colors)],
      //           pbe,
      //         }
      //       })

      //       chromas.push(...skinChromas)

      //       skins.push({
      //         id: String(skin.id),
      //         isLegacy: !!skin.isLegacy,
      //         contentId: skin.contentId,
      //         championId: champion.id,
      //         championKey: champion.key,
      //         championName: champion.name,
      //         name: skin.name,
      //         description: skin.description,
      //         pbe,
      //         image: {
      //           centered: getCDragonPath(skin.splashPath, pbe ? 'pbe' : 'latest'),
      //           uncentered: getCDragonPath(skin.uncenteredSplashPath, pbe ? 'pbe' : 'latest'),
      //           loading: getCDragonPath(skin.loadScreenPath, pbe ? 'pbe' : 'latest'),
      //         },
      //         rarity: skin.rarity,
      //         chromaPath: getCDragonPath(skin.chromaPath, pbe ? 'pbe' : 'latest'),
      //         chromas: skinChromas,
      //         skinlines: (skin.skinLines ?? [])
      //           .map((sl: any) => {
      //             const found = skinlines.find((s: any) => s.id === sl.id)
      //             return found ? { id: String(sl.id), name: found.name } : null
      //           })
      //           .filter(Boolean),
      //       })
      //     }
      //   }

      onProgress(`[${lang}] Skins: ${skins.length}, Chromas: ${chromas.length}`, "success");

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
    }
  }

  onProgress("PREPARE END", "success");
};
