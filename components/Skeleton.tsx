import { uniqueId } from 'lodash';
import type { ComponentProps, FC } from "react";

import { cn } from "@/shared/cn";

interface SkeletonProps extends ComponentProps<"div"> {
  rounded?: boolean;
  count?: number;
  asChild?: boolean;
  pulse?: boolean;
}

const SkeletonItem: FC<SkeletonProps> = ({ rounded, className, pulse = true, ...props }) => {
  return (
    <div
      className={cn("w-full rounded-sm h-6 bg-input", className, {
        ["rounded-full"]: rounded,
        ['animate-pulse']: pulse,
      })}
      {...props}
    ></div>
  );
};

const Skeleton: FC<SkeletonProps> = ({ count = 1, asChild, ...props }) => {
  if (count > 1 && !asChild) {
    return (
      <div className="flex flex-col gap-2 w-full">
        {Array.from({ length: count }, () => (
          <SkeletonItem key={uniqueId()} {...props} />
        ))}
      </div>
    );
  }

  return Array.from({ length: count }, () => <SkeletonItem key={uniqueId()} {...props} />);
};

export default Skeleton;
