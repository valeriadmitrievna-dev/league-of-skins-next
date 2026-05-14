"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/shared/cn";

interface AppNavigationLinkProps {
  icon: ReactNode;
  title?: string;
  href?: string;
  group?: { title: string; href: string }[];
}

const AppNavigationLink: FC<AppNavigationLinkProps> = ({ icon, title, href, group = [] }) => {
  const pathname = usePathname();
  const linkButtonCN = (active: boolean, className?: string) => cn(className, { "text-primary! bg-primary/10! hover:bg-primary/20!": active });

  if (href && !group.length) {
    return (
      <Tooltip disableHoverableContent>
        <TooltipTrigger asChild>
          <Button size="icon-xl" variant="ghost" className={linkButtonCN(pathname?.startsWith(href))} asChild>
            <Link href={href}>{icon}</Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8} className="[&_svg]:hidden!">
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <HoverCard openDelay={100} closeDelay={0}>
      <HoverCardTrigger asChild>
        <Button size="icon-xl" variant="ghost" className={linkButtonCN(group.some((link) => pathname.startsWith(link.href)))}>
          {icon}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side="right" align="start" sideOffset={0} alignOffset={-10} className="pl-2 border-none! bg-transparent! shadow-none ring-0">
        <div className="p-2 rounded-lg bg-popover flex flex-col shadow-lg/80">
          {group.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="lg"
              asChild
              className={cn("justify-start", {
                "text-primary!": pathname === link.href,
              })}
            >
              <Link href={link.href}>{link.title}</Link>
            </Button>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default AppNavigationLink;
