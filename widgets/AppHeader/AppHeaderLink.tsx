"use client";
import type { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { cn } from "@/shared/cn";
import { usePathname } from "next/navigation";

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
        "group relative font-medium text-center text-muted-foreground aria-[current=page]:text-primary",
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
