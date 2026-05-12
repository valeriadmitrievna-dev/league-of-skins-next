"use client";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

import Image from "@/components/Image";
import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import EmptyCollectionDashboard from "@/emptystates/EmptyCollectionDashboard";
import { fetchClient } from "@/lib/fetchClient";
import { cn } from "@/shared/cn";
import { StatsActivityResponse, StatsChromasResponse, StatsCollectionsResponse, StatsSocialResponse, StatsSpendingResponse } from "@/types/dashboard";
import DashboardCard from "@/widgets/Dashboard/DashboardCardWrapper";
import DashboardOverviewRow from "@/widgets/Dashboard/DashboardOverviewRow";
import SkinsRarity from "@/widgets/Dashboard/SkinsRarity";

const DashboardPage = () => {
  const { data: dashboardActivity } = useQuery<StatsActivityResponse>({
    queryKey: ["dashboard_activity"],
    queryFn: () => fetchClient("/api/user/collection/dashboard/activity"),
  });
  const { data: dashboardChromas } = useQuery<StatsChromasResponse>({
    queryKey: ["dashboard_chromas"],
    queryFn: () => fetchClient("/api/user/collection/dashboard/chromas"),
  });
  const { data: dashboardCollections } = useQuery<StatsCollectionsResponse>({
    queryKey: ["dashboard_collections"],
    queryFn: () => fetchClient("/api/user/collection/dashboard/collections"),
  });

  const { data: dashboardSocial } = useQuery<StatsSocialResponse>({
    queryKey: ["dashboard_social"],
    queryFn: () => fetchClient("/api/user/collection/dashboard/social"),
  });
  const { data: dashboardSpending } = useQuery<StatsSpendingResponse>({
    queryKey: ["dashboard_spending"],
    queryFn: () => fetchClient("/api/user/collection/dashboard/spending"),
  });
  console.log("[DEV]", { dashboardActivity, dashboardCollections, dashboardChromas, dashboardSocial, dashboardSpending });

  return (
    <div className="flex flex-col gap-3">
      <DashboardOverviewRow />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <DashboardCard>
          <Typography.P className="text-sm">Любимые линейки</Typography.P>

          <div className="flex flex-col gap-1 mt-3">
            {dashboardCollections?.skinlines?.map((skinline, index) => {
              const percent = (skinline.owned / skinline.total) * 100;
              return (
                <div key={skinline.id} className="flex gap-3 items-center">
                  <Typography.Small className="text-xs font-normal">0{index + 1}</Typography.Small>
                  <Image className="w-62 h-10 bg-black" />
                  <div className="w-full">
                    <div className="flex gap-3 items-center justify-between">
                      <Typography.Small className="text-xs font-normal">{skinline.name}</Typography.Small>
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
        </DashboardCard>
        <DashboardCard>
          <Typography.P className="text-sm">Топ чемпионов по количеству скинов</Typography.P>

          <div className="flex items-center gap-4 mt-7">
            {dashboardCollections?.champions?.map((champion, index) => (
              <div key={champion.id} className="relative flex flex-col items-center w-full">
                <div
                  className={cn(
                    "absolute -top-4 left-[50%] translate-x-[-50%] z-10 size-6 rounded-full flex items-center justify-center",
                    index === 0 && "bg-[#D8A550]",
                    index === 1 && "bg-[#BBBFCB]",
                    index === 2 && "bg-[#C7865E]",
                  )}
                >
                  <Typography.Small className="text-black mt-0.5">{index + 1}</Typography.Small>
                </div>
                <div
                  className={cn(
                    "max-w-23 max-h-23 w-full aspect-square rounded-full outline-2! outline-offset-2 overflow-hidden",
                    index === 0 && "outline-[#D8A550]!",
                    index === 1 && "outline-[#BBBFCB]!",
                    index === 2 && "outline-[#C7865E]!",
                  )}
                >
                  <Image className="w-full h-full bg-black" />
                </div>

                <Typography.Small className="mt-3 font-normal">{champion.name}</Typography.Small>
                <Typography.Small className="mt-1">
                  {champion.owned} <span className="text-xs font-normal text-white/80">/ {champion.total}</span>
                </Typography.Small>
              </div>
            ))}
          </div>
        </DashboardCard>
        <SkinsRarity className="md:col-span-2 lg:col-span-1" rarityData={dashboardSpending?.rarity} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {dashboardActivity?.timeline && (
          <DashboardCard>
            <Typography.P className="text-sm">Прогресс коллекции</Typography.P>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={dashboardActivity?.timeline}
                margin={{
                  top: 30,
                  right: 0,
                  bottom: 0,
                  left: 0,
                }}
              >
                <defs>
                  <linearGradient id="countColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#aaa" strokeOpacity="10%" vertical={false} />
                <Area type="natural" dataKey="count" stroke="#7f5adc" fill="url(#countColor)" strokeWidth={1} legendType="none" />
                <XAxis dataKey="month" tickFormatter={(value) => format(value, "MMM yyyy")} />
                <YAxis width="auto" dataKey="count" />
              </AreaChart>
            </ResponsiveContainer>
          </DashboardCard>
        )}
        <DashboardCard>
          <Typography.P className="text-sm">Недавние пополнения</Typography.P>

          <div className="grid grid-cols-4 gap-3 mt-3">
            {dashboardActivity?.recentSkins?.map((skin) => {
              const daysAgo = formatDistanceToNow(parseISO(skin.purchasedDate), { addSuffix: true });
              return (
                <div key={skin.contentId}>
                  <Image className="w-full aspect-square rounded-xl" />
                  <Typography.P className="mt-2 text-xs font-medium">{skin.name}</Typography.P>
                  <Typography.P className="mt-1 font-normal text-xs text-white/80">{daysAgo}</Typography.P>
                </div>
              );
            })}
          </div>
        </DashboardCard>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardCard>
          <Typography.P className="text-sm">Эстетика вашей коллекции</Typography.P>
        </DashboardCard>
        <DashboardCard>
          <Typography.P className="text-sm">Ваш ранг коллекции</Typography.P>

          <div className="flex gap-6 items-center mt-3">
            <Image className="w-30 aspect-square" />

            <div>
              <Typography.Large className="text-3xl font-medium">Топ {dashboardSocial?.comparedToAverage?.percentile ?? 0}%</Typography.Large>
              <Typography.P className="mt-1 text-xs font-normal text-white/80">
                Ваша коллекция лучше чем у {100 - (dashboardSocial?.comparedToAverage?.percentile ?? 0)}% игроков
              </Typography.P>
              <Button variant="secondary" className="mt-3 font-normal">
                Подробнее о Рангах
              </Button>
            </div>
          </div>
        </DashboardCard>
      </section>
    </div>
  );

  return <EmptyCollectionDashboard />;
};

export default DashboardPage;
