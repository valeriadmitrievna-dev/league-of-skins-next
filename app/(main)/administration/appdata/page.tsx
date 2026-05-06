"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { uniqBy } from "lodash";
import { useEffect, useState } from "react";

import LogLine from "@/components/LogLine";
import Skeleton from "@/components/Skeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from '@/components/ui/spinner';
import { fetchClient } from "@/lib/fetchClient";
import { Log } from "@/lib/logger";
import { cDragonUrl, dDragonUrl } from "@/shared/constants/riot";
import { LangProgress } from "@/shared/riot/types";
import { getCDragonPath } from "@/shared/utils/getCDragonPath";
import { AppDataChampion, AppDataChroma, AppDataLang, AppDataSkin, AppDataSkinline } from "@/types/appdata";
import { RiotChampion, RiotChampionItem, RiotSkinline } from "@/types/riot";
import AdminAppDataLanguage from "@/widgets/Admin/AdminAppDataLanguage";

const AdministrationAppData = () => {
  const [logs, setLogs] = useState<Omit<Log, "source">[]>([]);
  const [languages, setLanguages] = useState<Record<string, LangProgress>>({});
  const [globalLoading, setGlobalLoading] = useState(false);

  const { data, isLoading: loading } = useQuery({
    queryKey: ["admin-appdata"],
    queryFn: () => fetchClient<Record<string, LangProgress>>("/api/admin/appdata"),
    staleTime: 0,
  });

  const { mutate: saveAppData } = useMutation({
    mutationFn: (body: Omit<AppDataLang, "updated">) => fetchClient("/api/riot-save", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: async (_, { lang }) => {
      logger.success(`[${lang}] Successfully updated!`);
      updateLanguageState(lang, { status: "done" });
    },
    onError: (error, { lang }) => {
      logger.error(error.message);
      updateLanguageState(lang, { status: "done" });
    },
  });

  const addLog = (message: string, type: Log["type"], replaceLast?: boolean) => {
    setLogs((prev) => [{ type, time: new Date(), message }, ...prev.slice(replaceLast ? 1 : 0, prev.length)]);
  };

  const logger = {
    log: (message: string, replaceLast?: boolean) => addLog(message, "default", replaceLast),
    warning: (message: string, replaceLast?: boolean) => addLog(message, "warning", replaceLast),
    error: (message: string, replaceLast?: boolean) => addLog(message, "error", replaceLast),
    success: (message: string, replaceLast?: boolean) => addLog(message, "success", replaceLast),
  };

  const updateLanguageState = (lang: string, update: Partial<LangProgress>) => {
    setLanguages((prev) => {
      const prevLang = prev[lang] ?? {};
      return {
        ...prev,
        [lang]: {
          ...prevLang,
          ...update,
          categories: {
            ...(prevLang.categories ?? {}),
            ...(update.categories ?? {}),
          },
          counts: {
            ...(prevLang.counts ?? {}),
            ...(update.counts ?? {}),
          },
        } as LangProgress,
      };
    });
  };

  const updateHandler = async (langs: string | string[]) => {
    setLogs([]);
    setGlobalLoading(true);

    if (typeof langs !== "string") {
      setLanguages({});
    }

    if (typeof langs === "string") {
      setLanguages((prev) => ({
        ...prev,
        [langs]: {
          status: "idle",
        },
      }));
    }

    const updateLanguages = typeof langs === "string" ? [langs] : langs;

    for await (const lang of updateLanguages) {
      const cDragonLang = lang === "en_US" ? "default" : lang.toLowerCase();
      logger.log(`[${lang}] Start updating`);
      updateLanguageState(lang, { status: "loading" });

      // Get versions
      logger.log(`[${lang}] Get versions...`);
      updateLanguageState(lang, { categories: { versions: "loading" } });
      const versionsRes = await fetch("https://corsproxy.io/?" + encodeURIComponent(`${dDragonUrl}/api/versions.json`));
      const versions: string[] = await versionsRes.json();
      logger.success(`[${lang}] Versions: [${versions.slice(0, 3).join(", ")}, ...]`, true);
      updateLanguageState(lang, { categories: { versions: "done" } });

      const skinlinesLts: AppDataSkinline[] = [];
      const skinlinesPbe: AppDataSkinline[] = [];

      // Get latest skinlines
      try {
        logger.log(`[${lang}] Get skinlines...`);
        updateLanguageState(lang, { categories: { skinlines: "loading" } });
        const skinlinesLtsUrl = `${cDragonUrl}/latest/plugins/rcp-be-lol-game-data/global/${cDragonLang}/v1/skinlines.json`;
        const skinlinesLtsRes = await fetch(skinlinesLtsUrl);
        const riot_skinlinesLts: RiotSkinline[] = ((await skinlinesLtsRes.json()) ?? []).filter((s: RiotSkinline) => s.name);
        skinlinesLts.push(...riot_skinlinesLts);
        logger.success(`[${lang}] Skinlines: [${skinlinesLts.slice(0, 3).map((s) => s.name)}, ...]`, true);
        updateLanguageState(lang, { categories: { skinlines: "done" }, counts: { skinlines: skinlinesLts.length } });
      } catch (error) {
        logger.error(`[${lang}] Skinlines: ERROR`);
        logger.error(`[${lang}] ${(error as Error).message}`);
        updateLanguageState(lang, { categories: { skinlines: "error" } });

        updateLanguageState(lang, { status: "error" });
        setGlobalLoading(false);
        break;
      }

      // Get pbe skinlines
      try {
        logger.log(`[${lang}] Get skinlines PBE...`);
        const skinlinesPbeUrl = `${cDragonUrl}/pbe/plugins/rcp-be-lol-game-data/global/${cDragonLang}/v1/skinlines.json`;
        const skinlinesPbeRes = await fetch(skinlinesPbeUrl);
        const riot_skinlinesPbe: RiotSkinline[] = ((await skinlinesPbeRes.json()) ?? []).filter((s: RiotSkinline) => s.name);
        skinlinesPbe.push(...riot_skinlinesPbe);
        const skinlinesLogPart = skinlinesPbe.slice(0, 3).map((s) => s.name);
        logger.success(`[${lang}] Skinlines PBE: [${skinlinesLogPart.join(", ")}, ...]`, true);
      } catch (error) {
        logger.error(`[${lang}] Skinlines PBE: ERROR`);
        logger.error(`[${lang}] ${(error as Error).message}`);

        updateLanguageState(lang, { status: "error" });
        setGlobalLoading(false);
        break;
      }

      // Get champions
      const champions: AppDataChampion[] = [];
      try {
        logger.log(`[${lang}] Get champions...`);
        updateLanguageState(lang, { categories: { champions: "loading" } });
        const championsRes = await fetch(
          "https://corsproxy.io/?" + encodeURIComponent(`${dDragonUrl}/cdn/${versions[0]}/data/${lang}/champion.json`),
        );
        const championsObject = await championsRes.json();
        const riot_champions: RiotChampionItem[] = Object.values(championsObject.data);
        champions.push(
          ...riot_champions.map((c) => ({
            id: String(c.id),
            key: c.key,
            name: c.name,
            image: {
              full: `${dDragonUrl}/cdn/img/champion/splash/${c.id}_0.jpg`,
              loading: `${dDragonUrl}/cdn/img/champion/loading/${c.id}_0.jpg`,
              icon: `${cDragonUrl}/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${c.key}.png`,
            },
          })),
        );
        const championsLogPart = riot_champions.slice(0, 3).map((c) => c.name);
        logger.success(`[${lang}] Champions: [${championsLogPart.join(", ")}, ...]`, true);
        updateLanguageState(lang, { categories: { champions: "done" }, counts: { champions: riot_champions.length } });
      } catch (error) {
        logger.error(`[${lang}] Champions: ERROR`);
        logger.error(`[${lang}] ${(error as Error).message}`);
        updateLanguageState(lang, { categories: { champions: "error" } });

        updateLanguageState(lang, { status: "error" });
        setGlobalLoading(false);
        break;
      }

      const skinlines = uniqBy([...skinlinesLts, ...skinlinesPbe], "id");
      const skins: AppDataSkin[] = [];
      const chromas: AppDataChroma[] = [];

      // Get skins and chromas
      logger.log(`[${lang}] Get skins and chromas for each champion...`);
      updateLanguageState(lang, { categories: { skins: "loading", skins_pbe: "loading", chromas: "loading", chromas_pbe: "loading" } });

      try {
        for await (const champion of champions) {
          logger.log(`[${lang}] ${champion.name}`);
          const championLtsUrl = `${cDragonUrl}/latest/plugins/rcp-be-lol-game-data/global/${cDragonLang}/v1/champions/${champion.key}.json`;
          const championPbeUrl = `${cDragonUrl}/pbe/plugins/rcp-be-lol-game-data/global/${cDragonLang}/v1/champions/${champion.key}.json`;

          const championLtsRes = await fetch(championLtsUrl);
          const championPbeRes = await fetch(championPbeUrl);

          const championLts: RiotChampion = await championLtsRes.json();
          const championPbe: RiotChampion = await championPbeRes.json();

          const championSkinsLts = championLts.skins.filter((s) => !s.isBase).map((s) => s.contentId);
          const championSkins = championPbe.skins.filter((s) => !s.isBase);

          for (const skin of championSkins) {
            const pbe = !championSkinsLts.includes(skin.contentId);

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
                championId: championLts.alias,
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

          logger.success(`[${lang}] ${champion.name} - ${championSkins.length} skins`, true);
        }

        updateLanguageState(lang, {
          categories: { skins: "done", skins_pbe: "done", chromas: "done", chromas_pbe: "done" },
          counts: {
            skins: skins.filter((i) => !i.pbe).length,
            skins_pbe: skins.filter((i) => i.pbe).length,
            chromas: skins.filter((i) => !i.pbe).length,
            chromas_pbe: skins.filter((i) => i.pbe).length,
          },
        });
      } catch (error) {
        logger.error(`[${lang}] Error loadings skins and chromas`);
        logger.error(`[${lang}] ${(error as Error).message}`);
        updateLanguageState(lang, { status: "error", categories: { skins: "error", skins_pbe: "error", chromas: "error", chromas_pbe: "error" } });
        setGlobalLoading(false);
        break;
      }

      await saveAppData({ lang, champions, skinlines, skins, chromas });
    }

    setGlobalLoading(false);
  };

  useEffect(() => {
    if (data) {
      setLanguages(data);
    }
  }, [data]);

  return (
    <div className="grid grid-rows-[auto_1fr_360px] gap-2 h-full overflow-hidden">
      <div className="w-full bg-muted/50 overflow-hidden rounded-md p-2 flex justify-between g-x-10">
        <p className="max-w-180 font-mono">Use only with VPN</p>
        <Button onClick={() => updateHandler(["en_US", "ru_RU"])} disabled={globalLoading}>
          {globalLoading && <Spinner />}
          Update all data
        </Button>
      </div>
      <ScrollArea className="size-full bg-muted/50 overflow-hidden rounded-md p-2">
        <div className="grid grid-cols-3 gap-2">
          {loading && <Skeleton count={4} asChild />}
          {!loading &&
            languages &&
            Object.entries(languages).map(([lang, data]) => (
              <AdminAppDataLanguage key={lang} language={lang} data={data} onUpdate={() => updateHandler(lang)} />
            ))}
        </div>
      </ScrollArea>
      <ScrollArea className="size-full bg-muted/50 overflow-hidden rounded-md p-2">
        {logs.map((log, i) => (
          <LogLine key={i} {...log} className="text-xs" />
        ))}
      </ScrollArea>
    </div>
  );
};

export default AdministrationAppData;
