import { FC, ReactNode } from "react";

import { Typography } from "@/components/Typography";
import { Progress } from "@/components/ui/progress";

import DashboardCardWrapper from "./DashboardCardWrapper";

interface CardProps {
  icon: ReactNode;
  color: string;
  title: string;
  description: string;
  percent?: number;
  minValue?: number;
  maxValue?: number;
  className?: string;
}

const OverallStatisticCard: FC<CardProps> = ({ icon, color, title, description, percent, minValue, maxValue, className }) => {
  return (
    <DashboardCardWrapper className={className}>
      <div className="flex gap-4">
        <div className="shrink-0 size-9 rounded-full bg-[#454094]" style={{ backgroundColor: color }}>
          {icon}
        </div>

        <div>
          <Typography.Small className="text-xs font-normal">{title}</Typography.Small>
          <Typography.Large className="text-xl mt-2">
            {minValue} {!!maxValue && <span className="text-base font-normal text-white/80">/ {maxValue}</span>}
          </Typography.Large>
          <Typography.P className="text-sm">{description}</Typography.P>
        </div>
      </div>
      {!!percent && <Progress value={percent} color={color} className="h-2.5 mt-4" />}
    </DashboardCardWrapper>
  );
};

export default OverallStatisticCard;
