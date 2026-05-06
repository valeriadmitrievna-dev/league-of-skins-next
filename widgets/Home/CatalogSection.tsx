"use client";

import { useQuery } from "@tanstack/react-query";
import { useT } from "next-i18next/client";
import { useMemo, type FC } from "react";

import { Typography } from "@/components/Typography";
import { fetchClient } from "@/lib/fetchClient";
import { AppDataSkin } from "@/types/appdata";

import SubTitle from "./SubTitle";
import SkinCard from "../Skin/SkinCard";

const CatalogSection: FC = () => {
  const { t, i18n } = useT("home");

  const params = useMemo(
    () => ({
      lang: i18n.language,
      legacy: "all",
      server: "all",
      owned: "all",
      size: 20,
      page: 1,
    }),
    [i18n.language],
  );

  const {
    data: skins,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["homeSkins"],
    queryFn: () =>
      fetchClient<{ count: number; data: AppDataSkin[] }>("/api/skins", {
        headers: { Language: i18n.language },
        query: params,
      }).then((res) => res.data ?? []),
  });

  const duplicatedSkins = skins ? [...skins, ...skins] : null;

  return (
    <section className="mt-28">
      <SubTitle className="text-center">{t("catalog.subtitle")}</SubTitle>
      <Typography.H2 className="text-center mt-2">{t("catalog.title")}</Typography.H2>
      <Typography.Muted className="mt-2 text-center">{t("catalog.description")}</Typography.Muted>

      {isLoading || isFetching ? null : (
        <div className="overflow-hidden w-full relative h-85 mt-6">
          <div className="absolute left-0 top-0 flex gap-4 w-max slider-track">
            {duplicatedSkins?.map((skin: AppDataSkin, index) => (
              <SkinCard key={`${skin.contentId}-${index}`} data={skin} className="w-55 shrink-0" />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default CatalogSection;
