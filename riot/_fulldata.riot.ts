import { getVersions } from "../riot/versions.riot";
import { getSkinlines } from "../riot/skinlines.riot";
import { getChampions } from "../riot/champions.riot";
import { getChampion } from "../riot/champion.riot";
import { uniqBy } from "lodash";
import { getLangAppData } from "@/shared/api/utils/getLangAppData";
import { config } from "@/lib/config";
import { cDragonUrl, dDragonUrl } from "@/shared/constants/riot";
import { getCDragonPath } from "@/shared/api/utils/getCDragonPath";
import { progressLog, setCategoryStatus, setLangStatus } from "@/lib/riotProgress";

export const getFullDataRiot = async (lang: string) => {
  setCategoryStatus(lang, "versions", "loading");

  progressLog.default(`[${lang}] Get versions`);
  const versions = await getVersions(lang);

  if (versions?.length) {
    progressLog.default(`[${lang}] Versions: [${versions.slice(0, 3).join(", ")}${versions.length > 3 ? ", ..." : ""}]`);
    setCategoryStatus(lang, "versions", "done");
  } else {
    setCategoryStatus(lang, "versions", "error");
    setLangStatus(lang, "error");
    return;
  }

  const data: Pick<any, "champions" | "skinlines" | "skins" | "chromas"> = {
    champions: [],
    skins: [],
    skinlines: [],
    chromas: [],
  };

  progressLog.default(`[${lang}] Get previous skins`);
  const prevSkins = (await getLangAppData(lang))?.skins ?? [];
  progressLog.default(`[${lang}] Previous skins - ${prevSkins.length}`);

  setCategoryStatus(lang, "skinlines", "loading");
  progressLog.default(`[${lang}] Get skinlines`);
  const skinlines_latest: any[] = (await getSkinlines(lang)) ?? [];
  const skinlines_pbe: any[] = (await getSkinlines(lang, "pbe")) ?? [];
  const skinlines = uniqBy([...skinlines_latest, ...skinlines_pbe], "id");
  console.log("[DEV]", skinlines);

  if (skinlines?.length) {
    progressLog.success(`[${lang}] Skinlines - ${skinlines.length}`);
    setCategoryStatus(lang, "skinlines", "done");
  } else {
    setCategoryStatus(lang, "skinlines", "error");
    setLangStatus(lang, "error");
    return;
  }

  setCategoryStatus(lang, "champions", "loading");
  const riot_champions = (await getChampions(versions[0] ?? config.riotVersion, lang)) ?? [];

  if (riot_champions?.length) {
    progressLog.success(`[${lang}] Champions - ${riot_champions.length}`);
    setCategoryStatus(lang, "champions", "done");
  } else {
    setCategoryStatus(lang, "champions", "error");
    setLangStatus(lang, "error");
    return;
  }

  const champions: any[] = riot_champions.map((champion) => ({
    id: String(champion.id),
    key: champion.key,
    name: champion.name,
    image: {
      full: `${dDragonUrl}/cdn/img/champion/splash/${champion.id}_0.jpg`,
      loading: `${dDragonUrl}/cdn/img/champion/loading/${champion.id}_0.jpg`,
      icon: `${cDragonUrl}/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champion.key}.png`,
    },
  }));

  const skins: any[] = [];

  setCategoryStatus(lang, "skins", "loading");
  setCategoryStatus(lang, "chromas", "loading");

  for (const champion of champions) {
    progressLog.default(`[${lang}] Get champion: ${champion.name}`);
    const champion_data = await getChampion(champion.key, lang);
    const champion_data_pbe = await getChampion(champion.key, lang, "pbe");

    if (!champion_data && !champion_data_pbe) {
      progressLog.error(`[${lang}] Champion: ${champion.name}`);
      continue;
    }

    progressLog.success(`[${lang}] Champion: ${champion.name}`);
  }

  if (!skins.length) {
    setCategoryStatus(lang, "skins", "error");
    setCategoryStatus(lang, "chromas", "error");
    setLangStatus(lang, "error");
    return;
  }

  setCategoryStatus(lang, "skins", "done");
  setCategoryStatus(lang, "chromas", "done");

  return {};

  // for (const champion of champions) {
  //   const champion_data = await getChampion(champion.key, lang);
  //   const champion_data_pbe = await getChampion(champion.key, lang, "pbe");

  //   const skinMapper =
  //     (champion_data: any, pbeCheck: (skin: any) => boolean) =>
  //     (skin: any): any => {
  //       const pbe = pbeCheck(skin);
  //       const prevSkin = prevSkins.find((ps) => ps.contentId === skin.contentId);

  //       const chromas: any[] =
  //         (skin.chromas ?? []).map((chroma) => {
  //           const regex = /.*\(([^)]+)\)/;
  //           const match = chroma.name.match(regex);
  //           const chromaRuName = chroma.name.split("'")[chroma.name.split("'").length - 3];
  //           const chromaName = lang === "ru_RU" ? chromaRuName : (match?.[1] ?? chroma.name);

  //           return {
  //             id: String(chroma.id),
  //             name: chromaName,
  //             fullName: chroma.name,
  //             contentId: chroma.contentId,
  //             skinName: skin.name,
  //             skinContentId: skin.contentId,
  //             championId: champion_data.alias,
  //             path: getCDragonPath(chroma.chromaPath, pbe ? "pbe" : "latest"),
  //             colors: [...new Set(chroma.colors)],
  //             pbe,
  //           };
  //         }) ?? [];

  //       data.chromas.push(...chromas);

  //       return {
  //         id: String(skin.id),
  //         isLegacy: !!skin.isLegacy,
  //         contentId: skin.contentId,
  //         championId: champion.id,
  //         championKey: champion.key,
  //         championName: champion.name,
  //         name: skin.name,
  //         description: skin.description,
  //         pbe,
  //         price: prevSkin?.price,
  //         release: prevSkin?.release,
  //         sale: prevSkin?.sale,
  //         features: skin.skinFeaturePreviewData?.map((featureData) => ({
  //           ...featureData,
  //           iconPath: getCDragonPath(featureData.iconPath, pbe ? "pbe" : "latest"),
  //           videoPath: getCDragonPath(featureData.videoPath, pbe ? "pbe" : "latest"),
  //         })),
  //         image: {
  //           centered: getCDragonPath(skin.splashPath, pbe ? "pbe" : "latest"),
  //           uncentered: getCDragonPath(skin.uncenteredSplashPath, pbe ? "pbe" : "latest"),
  //           loading: getCDragonPath(skin.loadScreenPath, pbe ? "pbe" : "latest"),
  //         },
  //         ...(skin.splashVideoPath || skin.collectionSplashVideoPath || skin.collectionCardHoverVideoPath
  //           ? {
  //               video: {
  //                 centered: getCDragonPath(skin.splashVideoPath, pbe ? "pbe" : "latest"),
  //                 uncentered: getCDragonPath(skin.collectionSplashVideoPath, pbe ? "pbe" : "latest"),
  //                 card: getCDragonPath(skin.collectionCardHoverVideoPath, pbe ? "pbe" : "latest"),
  //               },
  //             }
  //           : {}),
  //         rarity: skin.rarity,
  //         chromaPath: getCDragonPath(skin.chromaPath, pbe ? "pbe" : "latest"),
  //         chromas,
  //         skinlines: (skin.skinLines ?? [])
  //           .map((skinline) => {
  //             const skinlineData = skinlines.find((sl) => sl.id === skinline.id);
  //             if (!skinlineData) return null;
  //             return { id: String(skinline.id), name: skinlineData.name };
  //           })
  //           .filter((skinline) => !!skinline),
  //         ...(skin.questSkinInfo
  //           ? {
  //               questSkinInfo: {
  //                 ...skin.questSkinInfo,
  //                 collectionCardPath: getCDragonPath(skin.questSkinInfo.collectionCardPath),
  //                 splashPath: getCDragonPath(skin.questSkinInfo.splashPath),
  //                 uncenteredSplashPath: getCDragonPath(skin.questSkinInfo.uncenteredSplashPath),
  //                 tiers: skin.questSkinInfo.tiers.map((tier) => ({
  //                   ...tier,
  //                   collectionCardHoverVideoPath: getCDragonPath(tier.collectionCardHoverVideoPath),
  //                   collectionSplashVideoPath: getCDragonPath(tier.collectionSplashVideoPath),
  //                   loadScreenPath: getCDragonPath(tier.loadScreenPath),
  //                   previewVideoUrl: getCDragonPath(tier.previewVideoUrl),
  //                   splashPath: getCDragonPath(tier.splashPath),
  //                   splashVideoPath: getCDragonPath(tier.splashVideoPath),
  //                   uncenteredSplashPath: getCDragonPath(tier.uncenteredSplashPath),
  //                 })),
  //               },
  //             }
  //           : {}),
  //       };
  //     };

  //   if (champion_data && champion_data_pbe) {
  //     const champion_skins = champion_data.skins.filter((skin) => !skin.isBase).map((skin) => skin.contentId);
  //     const champion_skins_pbe = champion_data_pbe.skins.filter((skin) => !skin.isBase) ?? [];
  //     const mappedSkins: any[] = champion_skins_pbe.map(
  //       skinMapper(champion_data, (skin) => !champion_skins.includes(skin.contentId)),
  //     );
  //     skins.push(...mappedSkins);
  //   } else if (champion_data && !champion_data_pbe) {
  //     const champion_skins = champion_data.skins.filter((skin) => !skin.isBase) ?? [];
  //     const mappedSkins: any[] = champion_skins.map(skinMapper(champion_data, () => false));
  //     skins.push(...mappedSkins);
  //   }
  // }

  // setCategoryStatus(lang, "skins", "done");
  // setCategoryStatus(lang, "chromas", "done");

  // data.skinlines.push(...skinlines);
  // data.champions.push(...champions);
  // data.skins.push(...skins);

  // return data;
};
