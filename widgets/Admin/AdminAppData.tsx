"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { prepareRiotClient } from "@/shared/riot/prepare";
import { LangProgress } from "@/shared/riot/types";
import { useState } from "react";

const AdminAppData = () => {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [languages, setLanguages] = useState<Record<string, LangProgress>>({});

  const updateHandler = async () => {
    setStatus("running");
    setLanguages({});

    await prepareRiotClient(["en_US", "ru_RU"], (lang, update) => {
      setLanguages((prev) => {
        const prevLang = prev[lang] ?? {};
        return {
          ...prev,
          [lang]: {
            ...prevLang,
            ...update,
            categories: {
              ...prevLang.categories,
              ...update.categories,
            },
          } as LangProgress,
        };
      });
    });
    setStatus("done");
  };

  return <ScrollArea className="size-full py-2 px-x">AdminAppData</ScrollArea>;
};

export default AdminAppData;
