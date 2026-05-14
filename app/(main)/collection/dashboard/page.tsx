"use client";
import { useQuery } from "@tanstack/react-query";
import { useT } from "next-i18next/client";

import Image from "@/components/Image";
import { Typography } from "@/components/Typography";
import EmptyCollectionDashboard from "@/emptystates/EmptyCollectionDashboard";
import { fetchClient } from "@/lib/fetchClient";
import { cn } from "@/shared/cn";
import { StatsChromasResponse, StatsOverviewResponse, StatsSpendingResponse } from "@/types/dashboard";
import DashboardActivityRow from "@/widgets/Dashboard/DashboardActivityRow";
import DashboardCard from "@/widgets/Dashboard/DashboardCardWrapper";
import DashboardCollectionRow from "@/widgets/Dashboard/DashboardCollectionRow";
import DashboardOverviewRow from "@/widgets/Dashboard/DashboardOverviewRow";
import DashboardSocialRow from "@/widgets/Dashboard/DashboardSocialRow";
import DashboardSpendingRow from "@/widgets/Dashboard/DashboardSpendingRow";

const DashboardPage = () => {
  const { t } = useT("dashboard");
  const { data: dashboardChromas } = useQuery<StatsChromasResponse>({
    queryKey: ["dashboard_chromas"],
    queryFn: () => fetchClient("/api/user/collection/dashboard/chromas"),
  });

  const { data: dashboardOverview } = useQuery<StatsOverviewResponse>({
    queryKey: ["dashboard_overview"],
    queryFn: () => fetchClient("/api/user/collection/dashboard/overview"),
  });
  const { data: dashboardSpending } = useQuery<StatsSpendingResponse>({
    queryKey: ["dashboard_spending"],
    queryFn: () => fetchClient("/api/user/collection/dashboard/spending"),
  });
  console.log("[DEV]", { dashboardChromas, dashboardOverview, dashboardSpending });

  return (
    <div className="flex flex-col gap-3">
      <DashboardOverviewRow data={dashboardOverview} totalRp={dashboardSpending?.totalRp} />
      <DashboardCollectionRow />
      <DashboardSpendingRow spendingData={dashboardSpending} />
      <DashboardSocialRow />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <DashboardCard>
          <Typography.P className="text-sm">{t("top-champions-by-number-of-skins")}</Typography.P>

          <div className="flex items-center gap-4 mt-7">
            {dashboardOverview?.topChampions?.slice(0, 3)?.map((topChampion) => (
              <div key={topChampion.champions[0].id} className="relative flex flex-col items-center w-full">
                <div
                  className={cn(
                    "absolute -top-4 left-[50%] translate-x-[-50%] z-10 size-6 rounded-full flex items-center justify-center",
                    topChampion.place === 1 && "bg-[#D8A550]",
                    topChampion.place === 2 && "bg-[#BBBFCB]",
                    topChampion.place === 3 && "bg-[#C7865E]",
                  )}
                >
                  <Typography.Small className="text-black mt-0.5">{topChampion.place}</Typography.Small>
                </div>
                <div
                  className={cn(
                    "max-w-23 max-h-23 w-full aspect-square rounded-full outline-2! outline-offset-2 overflow-hidden",
                    topChampion.place === 1 && "outline-[#D8A550]!",
                    topChampion.place === 2 && "outline-[#BBBFCB]!",
                    topChampion.place === 3 && "outline-[#C7865E]!",
                  )}
                >
                  <Image src={topChampion.champions[0].image.icon || ""} className="w-full h-full bg-black" />
                </div>

                <Typography.Small className="mt-3 font-normal">{topChampion.champions[0].name}</Typography.Small>
                <Typography.Small className="mt-1">
                  {topChampion.count}{" "}
                  <span className="text-xs font-normal text-white/80">{t("common:shared.skin", { count: topChampion.count })}</span>
                </Typography.Small>
              </div>
            ))}
          </div>
        </DashboardCard>
        <DashboardCard>
          <Typography.P className="text-sm">{t("most-common-colors-in-collection")}</Typography.P>

          <div className="flex flex-col gap-3 mt-3">
            {dashboardChromas?.mostFrequentColors?.map((color) => (
              <div key={color.color} className="flex items-center gap-2">
                <div className="size-4 rounded-sm" style={{ background: color.color }} />
                <Typography.Small>
                  {color.count} <span className="font-normal">{t("common:shared.skin", { count: color.count })}</span>
                </Typography.Small>
              </div>
            ))}
          </div>
        </DashboardCard>
      </section>

      <DashboardActivityRow />
    </div>
  );

  return <EmptyCollectionDashboard />;
};

export default DashboardPage;
