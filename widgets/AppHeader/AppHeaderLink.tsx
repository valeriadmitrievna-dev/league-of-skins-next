"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";

import { cn } from "@/shared/cn";


interface AppHeaderLinkProps {
  className?: string;
  to: string;
  text: string;
  disabled?: boolean;
  onClick?: () => void;
}

const AppHeaderLink: FC<AppHeaderLinkProps> = ({ className, to, text, disabled, onClick }) => {
  const pathname = usePathname();

  return (
    <Link
      href={to}
      onClick={onClick}
      className={cn(
        "group relative font-medium text-center text-muted-foreground",
        disabled && "pointer-events-none opacity-50",
        { "text-primary": pathname.startsWith(to) },
        className,
      )}
    >
      {text}
    </Link>
  );
};

export default AppHeaderLink;
