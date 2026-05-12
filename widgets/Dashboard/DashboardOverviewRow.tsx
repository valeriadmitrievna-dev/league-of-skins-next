import { useQuery } from "@tanstack/react-query";
import { FC } from "react";

import Skeleton from "@/components/Skeleton";
import { fetchClient } from "@/lib/fetchClient";
import { StatsOverviewResponse } from "@/types/dashboard";

import OverallStatisticCard from "./OverallStatisticCard";

const DashboardOverviewRow: FC = () => {
  const { data, isLoading, isFetching } = useQuery<StatsOverviewResponse>({
    queryKey: ["dashboard_overview"],
    queryFn: () => fetchClient("/api/user/collection/dashboard/overview"),
  });

  const skinsPercent = data?.skinsTotal ? (data.skinsTotal.owned / data.skinsTotal.total) * 100 : 0;
  const chromasPercent = data?.chromasTotal ? (data.chromasTotal.owned / data.chromasTotal.total) * 100 : 0;
  const championsWithSkinsPercent = data?.championsWithSkins ? (data.championsWithSkins.owned / data.championsWithSkins.total) * 100 : 0;

  if (isLoading || isFetching) {
    return (
      <section className="grid grid-cols-4 gap-4">
        <Skeleton className="h-29.25 rounded-xl" />
        <Skeleton className="h-29.25 rounded-xl" />
        <Skeleton className="h-29.25 rounded-xl" />
        <Skeleton className="h-29.25 rounded-xl" />
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <OverallStatisticCard
        title="Скины"
        minValue={data?.skinsTotal?.owned}
        maxValue={data?.skinsTotal?.total}
        percent={skinsPercent}
        description={`${skinsPercent.toFixed(1)}% от всей коллекции`}
        icon={<></>}
        color="#454094"
      />
      <OverallStatisticCard
        title="Цветовые схемы"
        minValue={data?.chromasTotal?.owned}
        maxValue={data?.chromasTotal?.total}
        percent={chromasPercent}
        description={`${chromasPercent.toFixed(1)}% от всей коллекции`}
        icon={<></>}
        color="#454094"
      />
      <OverallStatisticCard title="Потрачено RP" minValue={data?.skinsTotal?.owned} description={``} icon={<></>} color="#886029" />
      <OverallStatisticCard
        title="Чемпионов со скинами"
        minValue={data?.championsWithSkins?.owned}
        maxValue={data?.championsWithSkins?.total}
        percent={championsWithSkinsPercent}
        description={`${championsWithSkinsPercent.toFixed(1)}% чемпионов`}
        icon={<></>}
        color="#237861"
      />
    </section>
  );
};

export default DashboardOverviewRow;
