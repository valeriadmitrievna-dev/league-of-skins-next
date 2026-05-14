import { useQuery } from "@tanstack/react-query";
import { useT } from "next-i18next/client";
import { FC } from "react";

import Image from "@/components/Image";
import { Typography } from "@/components/Typography";
import { fetchClient } from "@/lib/fetchClient";
import { StatsSocialResponse } from "@/types/dashboard";

import DashboardCardWrapper from "./DashboardCardWrapper";

const DashboardSocialRow: FC = () => {
  const { t } = useT("dashboard");
  const { data: dashboardSocial } = useQuery<StatsSocialResponse>({
    queryKey: ["dashboard_social"],
    queryFn: () => fetchClient("/api/user/collection/dashboard/social"),
  });
  console.log({ dashboardSocial });
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <DashboardCardWrapper>
        <Typography.P className="text-sm">{t("social.most-rare-skin")}</Typography.P>
        <div className="mt-3 flex gap-6 items-center">
          <Image src={dashboardSocial?.rarestSkin?.data?.image?.centered || ""} className="h-60 w-40 object-cover rounded-xl" />

          <div>
            <Typography.Large className="text-2xl mt-1 font-medium">{dashboardSocial?.rarestSkin?.data?.name}</Typography.Large>

            <Typography.P className="mt-6">Owned by</Typography.P>
            <Typography.Large className="mt-1 text-4xl text-[#7F5ADC]">{dashboardSocial?.rarestSkin?.ownershipPercent}%</Typography.Large>
            <Typography.P className="mt-1">of players</Typography.P>

            <div className="mt-6 rounded-md py-1 px-2 bg-black/30 w-fit">
              <Typography.Small className="font-normal">{t(`rarity.${dashboardSocial?.rarestSkin?.data?.rarity}`)}</Typography.Small>
            </div>
          </div>
        </div>
      </DashboardCardWrapper>

      <DashboardCardWrapper>
        <Typography.P className="text-sm">Compared to average player</Typography.P>

        <div className="flex gap-6 items-center mt-3">
          <Image className="w-30 aspect-square" />

          <div>
            <Typography.Large className="text-3xl font-medium">Топ {dashboardSocial?.comparedToAverage?.percentile ?? 0}%</Typography.Large>
            <Typography.P className="mt-1 text-xs font-normal text-white/80">
              You own more skins than {100 - (dashboardSocial?.comparedToAverage?.percentile ?? 0)}% players
            </Typography.P>
          </div>
        </div>
      </DashboardCardWrapper>
    </section>
  );
};

export default DashboardSocialRow;
