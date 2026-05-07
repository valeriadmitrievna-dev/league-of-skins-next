"use client";
import { usePathname } from 'next/navigation';
import { FC } from "react";

import { NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

import AppHeaderListItem from "./AppHeaderListItem";

interface AppHeaderNavGroupProps {
  children: string;
  group: string;
  links: { href: string; title: string; text?: string }[];
}

const AppHeaderNavGroup: FC<AppHeaderNavGroupProps> = ({ children, group, links }) => {
  const pathname = usePathname();

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger data-active={pathname.startsWith(group)}>{children}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="w-80 flex flex-col gap-y-1">
          {links.map((link) => (
            <AppHeaderListItem key={link.href} {...link} active={pathname.startsWith(link.href)} />
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default AppHeaderNavGroup;
