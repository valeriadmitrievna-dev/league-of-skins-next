import { CircleQuestionMarkIcon } from "lucide-react";
import type { FC, ReactNode } from "react";

import { Typography } from "@/components/Typography";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SkinInfoLineProps {
  title: string;
  info: ReactNode;
  helpText?: string;
}

const SkinInfoLine: FC<SkinInfoLineProps> = ({ title, info, helpText }) => {
  return (
    <div className="not-last:mb-3">
      <div className="flex gap-x-2 justify-between items-center min-h-5">
        <span className="inline-flex gap-1">
          {title}
          {!!helpText && (
            <div className="hidden md:block">
              <Tooltip>
                <TooltipTrigger asChild>
                  <CircleQuestionMarkIcon className="size-3.25 text-foreground/60 cursor-help transform translate-y-0.5" />
                </TooltipTrigger>
                <TooltipContent>{helpText}</TooltipContent>
              </Tooltip>
            </div>
          )}
        </span>
        <div className="grow border-b border-dashed h-2.5" />
        {info}
      </div>

      {!!helpText && <Typography.Muted className="md:hidden text-xs text-end">{helpText}</Typography.Muted>}
    </div>
  );
};

export default SkinInfoLine;
