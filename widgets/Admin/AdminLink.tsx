"use client";
import { cn } from "@/shared/cn";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface AdminLinkProps extends LinkProps {
  children: string;
  className?: string;
}

const AdminLink: FC<AdminLinkProps> = ({ children, className, ...props }) => {
  const pathname = usePathname();

  return (
    <Link
      className={cn(
        "px-2 py-2 rounded-md font-medium hover:bg-background/20 font-mono",
        {
          "text-primary bg-background/20": pathname.startsWith(String(props.href)),
        },
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

export default AdminLink;
