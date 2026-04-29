import type { FC } from "react";

import { cn } from "@/shared/cn";

interface ChromaColorProps {
  colors: string[];
  className?: string;
  onClick?: () => void;
}

const ChromaColor: FC<ChromaColorProps> = ({ colors, className, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "size-5 rounded-full overflow-hidden relative shrink-0",
        { "bg-background": colors.length > 1 },
        { "cursor-pointer": !!onClick },
        className,
      )}
    >
      <div className="size-full rotate-45 flex gap-px absolute top-1/2 left-1/2 -translate-1/2 scale-[1.5]">
        <div className="size-full" style={{ background: colors[0] }} />
        {colors.length > 1 && <div className="size-full" style={{ background: colors[1] }} />}
      </div>
    </div>
  );
};

export default ChromaColor;
