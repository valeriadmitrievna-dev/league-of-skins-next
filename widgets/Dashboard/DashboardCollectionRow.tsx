import { useQuery } from "@tanstack/react-query";
import { useT } from "next-i18next/client";
import { FC } from "react";

import Image from "@/components/Image";
import { Typography } from "@/components/Typography";
import { Progress } from "@/components/ui/progress";
import { fetchClient } from "@/lib/fetchClient";
import { StatsCollectionsResponse } from "@/types/dashboard";

import DashboardCardWrapper from "./DashboardCardWrapper";

const DashboardCollectionRow: FC = () => {
  const { t } = useT("dashboard");

  const { data: dashboardCollections } = useQuery<StatsCollectionsResponse>({
    queryKey: ["dashboard_collections"],
    queryFn: () => fetchClient("/api/user/collection/dashboard/collections"),
  });

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <DashboardCardWrapper>
        <Typography.P className="text-sm">{t("collection.favorite-skinlines")}</Typography.P>

        <div className="flex flex-col gap-1 mt-3">
          {dashboardCollections?.skinlines?.slice(0, 3)?.map((skinline, index) => {
            const percent = (skinline.owned / skinline.total) * 100;
            return (
              <div key={skinline.id} className="flex gap-3 items-center">
                <Typography.Small className="text-xs font-normal">0{index + 1}</Typography.Small>
                <Image src={skinline.image.centered || ""} className="w-62 h-15 bg-black object-cover rounded-sm" alt="" />
                <div className="w-full">
                  <div className="flex gap-3 items-center justify-between">
                    <Typography.Small className="font-normal">{skinline.name}</Typography.Small>
                    <Typography.Small className="shrink-0">
                      {skinline.owned} <span className="text-xs font-normal text-white/80">/ {skinline.total}</span>
                    </Typography.Small>
                  </div>
                  <Progress value={percent} color={"#7F5ADC"} className="h-1.5 mt-2" />
                </div>
              </div>
            );
          })}
        </div>
      </DashboardCardWrapper>

      <DashboardCardWrapper>
        <Typography.P className="text-sm">{t("collection.completed-champions")}</Typography.P>

        <div className="flex flex-col gap-1 mt-3">
          {dashboardCollections?.champions?.slice(0, 3)?.map((champion, index) => {
            const percent = (champion.owned / champion.total) * 100;
            return (
              <div key={champion.id} className="flex gap-3 items-center">
                <Typography.Small className="text-xs font-normal">0{index + 1}</Typography.Small>
                <Image src={champion.image.full || ""} className="w-62 h-15 bg-black object-cover rounded-sm" />
                <div className="w-full">
                  <div className="flex gap-3 items-center justify-between">
                    <Typography.Small className="font-normal">{champion.name}</Typography.Small>
                    <Typography.Small className="shrink-0">
                      {champion.owned} <span className="text-xs font-normal text-white/80">/ {champion.total}</span>
                    </Typography.Small>
                  </div>
                  <Progress value={percent} color={"#7F5ADC"} className="h-1.5 mt-2" />
                </div>
              </div>
            );
          })}
        </div>
      </DashboardCardWrapper>

      <DashboardCardWrapper>
        <Typography.P className="text-sm">{t("collection.most-chromas-skins")}</Typography.P>

        <div className="flex flex-col gap-1 mt-3">
          {dashboardCollections?.skinChromas?.slice(0, 3)?.map((chroma, index) => {
            const percent = (chroma.owned / chroma.total) * 100;
            return (
              <div key={chroma.skinId} className="flex gap-3 items-center">
                <Typography.Small className="text-xs font-normal">0{index + 1}</Typography.Small>
                <Image src={chroma.image.centered || ""} className="w-62 h-15 bg-black object-cover rounded-sm" />
                <div className="w-full">
                  <div className="flex gap-3 items-center justify-between">
                    <Typography.Small className="font-normal">{chroma.skinName}</Typography.Small>
                    <Typography.Small className="shrink-0">
                      {chroma.owned} <span className="text-xs font-normal text-white/80">/ {chroma.total}</span>
                    </Typography.Small>
                  </div>
                  <Progress value={percent} color={"#7F5ADC"} className="h-1.5 mt-2" />
                </div>
              </div>
            );
          })}
        </div>
      </DashboardCardWrapper>
    </section>
  );
};

export default DashboardCollectionRow;
