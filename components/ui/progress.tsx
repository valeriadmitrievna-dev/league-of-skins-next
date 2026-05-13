"use client";

import { Progress as ProgressPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/shared/cn";

function Progress({ className, value, color, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full flex-1 bg-primary transition-all rounded-full"
        style={{ transform: `translateX(-${100 - (value || 0)}%)`, backgroundColor: color }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
