import { FC } from "react";

import { Typography } from "@/components/Typography";
import { cn } from "@/shared/cn";
import { WithClassName } from "@/shared/types";

interface WishlistStatCardProps {
  label: string;
  value: string;
  sub: string;
  accent?: string;
}

const WishlistStatCard: FC<WithClassName<WishlistStatCardProps>> = ({ label, value, sub, accent = "primary", className }) => {
  return (
    <div
      className={cn(
        "bg-card rounded-md overflow-hidden px-5 py-4 relative after:absolute after:size-full after:inset-0 after:bg-linear-to-r after:to-(--card-color)/5",
        className,
      )}
      style={{ "--card-color": `var(--${accent})` } as React.CSSProperties}
    >
      <Typography.Muted className="uppercase">{label}</Typography.Muted>
      <Typography.Large
        className="text-4xl my-1 uppercase text-(--card-text) truncate"
        style={{ "--card-text": `var(--${accent})` } as React.CSSProperties}
      >
        {value}
      </Typography.Large>
      <Typography.Muted className="flex items-center gap-x-0">{sub}</Typography.Muted>
    </div>
  );
};

export default WishlistStatCard;
