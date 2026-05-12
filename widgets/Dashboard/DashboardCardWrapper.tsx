import { FC, PropsWithChildren } from "react";

import { cn } from "@/shared/cn";

interface DashboardCardWrapperProps extends PropsWithChildren {
  className?: string;
}

const DashboardCardWrapper: FC<DashboardCardWrapperProps> = ({ className, children }) => {
  return <div className={cn("px-3 py-2 lg:px-4 lg:py-3 bg-muted/50 rounded-xl w-full border border-white/5", className)}>{children}</div>;
};

export default DashboardCardWrapper;
