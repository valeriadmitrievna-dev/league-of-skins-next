import { useT } from "next-i18next/client";
import { FC } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Typography } from "@/components/Typography";
import { RarityEntry } from "@/types/dashboard";

import DashboardCardWrapper from "./DashboardCardWrapper";

const COLORS = {
  kNoRarity: "#2F80ED",
  kEpic: "#5B4BDB",
  kMythic: "#8B5CF6",
  kLegendary: "#C94CCF",
  kTranscendent: "#00C2A8",
  kRare: "#27AE60",
  kUltimate: "#F2994A",
  kExalted: "#E63946",
};

interface SkinsRarityProps {
  rarityData: RarityEntry[] | undefined;
  className?: string;
}

const SkinsRarity: FC<SkinsRarityProps> = ({ className, rarityData }) => {
  const { t } = useT();
  const total = rarityData ? rarityData.reduce((acc, item) => acc + item.owned, 0) : 0;

  return (
    <DashboardCardWrapper className={className}>
      <Typography.P className="text-sm">{t("dashboard:social.skin-rarity")}</Typography.P>

      <div className="flex items-center gap-6">
        <div className="w-60 h-60 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={rarityData} dataKey="owned" nameKey="rarity" innerRadius={70} outerRadius={110} paddingAngle={2} stroke="none">
                {rarityData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.rarity as keyof typeof COLORS]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">{total}</span>
            <span className="text-sm text-gray-400">всего</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 pr-4">
          {rarityData
            ?.filter((elem) => elem.owned > 0)
            ?.map((item) => {
              const percent = ((item.owned / total) * 100).toFixed(1);

              return (
                <div key={item.rarity} className="flex items-center justify-between gap-8 min-w-55">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[item.rarity as keyof typeof COLORS] }} />
                    <span className="text-sm text-gray-300">{t(`rarity.${item.rarity}`)}</span>
                  </div>

                  <span className="text-sm text-gray-400">
                    {item.owned} ({percent}%)
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </DashboardCardWrapper>
  );
};

export default SkinsRarity;
