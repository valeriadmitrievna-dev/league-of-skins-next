import { useT } from "next-i18next/client";
import { FC } from "react";

import { StatsOverviewResponse } from "@/types/dashboard";

import OverallStatisticCard from "./OverallStatisticCard";

interface OverviewRowProps {
  data: StatsOverviewResponse | undefined;
  totalRp: number | undefined;
}

const DashboardOverviewRow: FC<OverviewRowProps> = ({ data, totalRp }) => {
  const { t } = useT("dashboard");

  const skinsPercent = data?.skinsTotal ? (data.skinsTotal.owned / data.skinsTotal.total) * 100 : 0;
  const chromasPercent = data?.chromasTotal ? (data.chromasTotal.owned / data.chromasTotal.total) * 100 : 0;
  const championsWithSkinsPercent = data?.championsWithSkins ? (data.championsWithSkins.owned / data.championsWithSkins.total) * 100 : 0;
  const legacySkinsPercent = data?.legacySkins ? (data.legacySkins.owned / data.legacySkins.total) * 100 : 0;
  console.log({ data });
  return (
    <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <OverallStatisticCard
        title={t("overview.skins")}
        minValue={data?.skinsTotal?.owned}
        maxValue={data?.skinsTotal?.total}
        percent={skinsPercent}
        description={`${skinsPercent.toFixed(1)}% ${t("overview.from-entire-collection")}`}
        icon={<></>}
        color="#454094"
      />
      <OverallStatisticCard
        title={t("overview.chromas")}
        minValue={data?.chromasTotal?.owned}
        maxValue={data?.chromasTotal?.total}
        percent={chromasPercent}
        description={`${chromasPercent.toFixed(1)}% ${t("overview.from-entire-collection")}`}
        icon={<></>}
        color="#454094"
      />
      <OverallStatisticCard title={t("overview.rp-spent")} minValue={totalRp} description={``} icon={<></>} color="#886029" />
      <OverallStatisticCard
        title={t("overview.champions-with-skins")}
        minValue={data?.championsWithSkins?.owned}
        maxValue={data?.championsWithSkins?.total}
        percent={championsWithSkinsPercent}
        description={t("overview.champions-percent", { amount: championsWithSkinsPercent.toFixed(1) })}
        icon={<></>}
        color="#237861"
      />
      <OverallStatisticCard
        title={t("overview.legacy-skins")}
        minValue={data?.legacySkins?.owned}
        maxValue={data?.legacySkins?.total}
        percent={legacySkinsPercent}
        description={t("overview.legacy-skins-percent", { amount: legacySkinsPercent.toFixed(1) })}
        icon={<></>}
        color="#237861"
      />
    </section>
  );
};

export default DashboardOverviewRow;
