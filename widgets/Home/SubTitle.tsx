import type { FC, ReactNode } from "react";

import { Typography } from "@/components/Typography";
import { cn } from "@/shared/cn";

interface SubTitleProps {
  children: ReactNode;
  className?: string;
}
const SubTitle: FC<SubTitleProps> = ({ children, className }) => {
  return <Typography.Small className={cn("block text-primary text-sm uppercase", className)}>{children}</Typography.Small>;
};

export default SubTitle;
