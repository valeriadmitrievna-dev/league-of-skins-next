import type { FC } from "react";

import Link from "next/link";
import { cn } from "@/shared/client/utils/cn";

interface AppHeaderLinkProps {
  className?: string;
  to: string;
  text: string;
  disabled?: boolean;
  onClick?: () => void;
}

const AppHeaderLink: FC<AppHeaderLinkProps> = ({
  className,
  to,
  text,
  disabled,
  onClick,
}) => {
  return (
    <Link
      href={to}
      onClick={onClick}
      className={cn(
        "group relative font-medium text-center text-muted-foreground aria-[current=page]:text-primary",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      {text}
    </Link>
  );
};

export default AppHeaderLink;
