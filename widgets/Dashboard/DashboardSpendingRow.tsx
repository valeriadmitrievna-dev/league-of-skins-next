import { Crown } from "lucide-react";
import { useT } from "next-i18next/client";
import { FC } from "react";

import Image from "@/components/Image";
import { Typography } from "@/components/Typography";
import { StatsSpendingResponse } from "@/types/dashboard";

import DashboardCardWrapper from "./DashboardCardWrapper";
import SkinsRarity from "./SkinsRarity";

interface SpendingRowProps {
  spendingData: StatsSpendingResponse | undefined;
}

const DashboardSpendingRow: FC<SpendingRowProps> = ({ spendingData }) => {
  const { t } = useT("dashboard");

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <SkinsRarity className="md:col-span-2 lg:col-span-1" rarityData={spendingData?.rarity} />
      <DashboardCardWrapper>
        <Typography.P className="text-sm">{t("spendings.most-expensive-champion")}</Typography.P>

        <div className="flex items-center justify-between gap-4 mt-4">
          <div>
            <Typography.Large className="text-3xl font-medium">{spendingData?.mostExpensiveChampion?.champion?.name}</Typography.Large>
            <Typography.Large className="mt-6 text-5xl font-bold text-[#D8A550]">{spendingData?.mostExpensiveChampion?.totalRp}</Typography.Large>
            <Typography.P className="mt-1">{t("spendings.rp-spent")}</Typography.P>
          </div>

          <div className="relative mx-auto">
            <Crown size={32} className="absolute -top-4 right-7 rotate-30 stroke-[#D8A550] fill-[#D8A550]" />
            <Image src={spendingData?.mostExpensiveChampion?.champion?.image?.full || ""} className="size-50 object-cover rounded-full " />
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.15), inset 0 0 12px 6px rgba(0,0,0,0.8)" }}
            ></div>
          </div>
        </div>
      </DashboardCardWrapper>
    </section>
  );
};

export default DashboardSpendingRow;
