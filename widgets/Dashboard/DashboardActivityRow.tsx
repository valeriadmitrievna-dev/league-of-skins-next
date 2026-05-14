import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { Calendar } from "lucide-react";
import { useT } from "next-i18next/client";
import { FC } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

import Image from "@/components/Image";
import { Typography } from "@/components/Typography";
import { fetchClient } from "@/lib/fetchClient";
import { StatsActivityResponse } from "@/types/dashboard";

import DashboardCardWrapper from "./DashboardCardWrapper";

const DashboardActivityRow: FC = () => {
  const { t } = useT("dashboard");
  const { data: dashboardActivity } = useQuery<StatsActivityResponse>({
    queryKey: ["dashboard_activity"],
    queryFn: () => fetchClient("/api/user/collection/dashboard/activity"),
  });

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <DashboardCardWrapper>
        <Typography.P className="text-sm">{t("activity.collection-progress")}</Typography.P>
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
      </DashboardCardWrapper>

      <DashboardCardWrapper>
        <Typography.P className="text-sm">{t("activity.recent-additions")}</Typography.P>

        <div className="grid grid-cols-5 gap-3 mt-3">
          {dashboardActivity?.recentSkins?.map((skin) => {
            const daysAgo = formatDistanceToNow(parseISO(skin.date), { addSuffix: true });
            return (
              <div key={skin.data.contentId}>
                <Image src={skin.data.image.centered || ""} className="w-full aspect-square rounded-xl object-cover" />
                <Typography.P className="mt-2 text-xs font-medium">{skin.data.name}</Typography.P>
                <Typography.P className="mt-1 font-normal text-xs text-white/80">{daysAgo}</Typography.P>
              </div>
            );
          })}
        </div>
      </DashboardCardWrapper>
      <DashboardCardWrapper>
        <Typography.P className="text-sm">{t("activity.longest-no-new-skin-streak")}</Typography.P>

        <div className="flex items-center justify-between mt-3">
          <div>
            <Typography.Large className="text-6xl text-pink-600">{dashboardActivity?.longestStreak?.days}</Typography.Large>
            <Typography.Small>{t("activity.days", { count: dashboardActivity?.longestStreak?.days })}</Typography.Small>

            <div className="flex gap-2 mt-6">
              <Calendar size={16} className="shrink-0" />
              <Typography.P className="text-sm font-normal">
                {t("activity.date-range", {
                  fromDate: dashboardActivity?.longestStreak?.from ? format(dashboardActivity?.longestStreak?.from, "dd MMM yyyy") : "",
                  toDate: dashboardActivity?.longestStreak?.to ? format(dashboardActivity?.longestStreak?.to, "dd MMM yyyy") : "",
                })}
              </Typography.P>
            </div>
          </div>

          <Image className="w-32.5 h-60" />
        </div>
      </DashboardCardWrapper>

      <DashboardCardWrapper>
        <Typography.P className="text-sm">{t("activity.biggest-collection-year")}</Typography.P>

        <div className="flex items-center justify-between mt-3">
          <div>
            <Typography.Large className="text-6xl text-violet-500">{dashboardActivity?.biggestYear?.year}</Typography.Large>
            <Typography.Large className="mt-5">{dashboardActivity?.biggestYear?.count}</Typography.Large>

            <Typography.Small className="mt-2">{t("activity.skins-added", { count: dashboardActivity?.biggestYear?.count })}</Typography.Small>
          </div>

          <Image className="w-32.5 h-60" />
        </div>
      </DashboardCardWrapper>
    </section>
  );
};

export default DashboardActivityRow;
