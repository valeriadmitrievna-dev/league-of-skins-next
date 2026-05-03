"use client";
import LogLine from "@/components/LogLine";
import Skeleton from "@/components/Skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchClient } from "@/lib/fetchClient";
import { Log } from "@/lib/logger";
import { prepareRiotClient } from "@/shared/riot/prepare";
import { LangProgress, LogType } from "@/shared/riot/types";
import AdminAppDataLanguage from "@/widgets/Admin/AdminAppDataLanguage";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const AdministrationAppData = () => {
  const [logs, setLogs] = useState<Omit<Log, "source">[]>([]);
  const [languages, setLanguages] = useState<Record<string, LangProgress>>({});

  const { data, isLoading: loading } = useQuery({
    queryKey: ["admin-appdata"],
    queryFn: () => fetchClient<Record<string, LangProgress>>("/api/admin/appdata"),
    staleTime: 0,
  });

  const logger = {
    log: (...messages: string[]) =>
      setLogs((prev) => [...prev, { type: "default", time: new Date(), message: messages.join(" ") }]),
    error: (...messages: string[]) =>
      setLogs((prev) => [...prev, { type: "error", time: new Date(), message: messages.join(" ") }]),
    success: (...messages: string[]) =>
      setLogs((prev) => [...prev, { type: "success", time: new Date(), message: messages.join(" ") }]),
    warning: (...messages: string[]) =>
      setLogs((prev) => [...prev, { type: "warning", time: new Date(), message: messages.join(" ") }]),
  };

  const updateHandler = async (langs: string | string[]) => {
    setLogs([]);

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

    const languages = typeof langs === "string" ? [langs] : langs;

    await prepareRiotClient(languages, logger, (lang, update) => {
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
    });
  };

  useEffect(() => {
    if (data) setLanguages(data);
  }, [data]);

  return (
    <div className="grid grid-cols-[1fr_360px] gap-x-2 h-full overflow-hidden">
      <ScrollArea className="size-full bg-muted/50 overflow-hidden rounded-md p-2">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-2">
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
