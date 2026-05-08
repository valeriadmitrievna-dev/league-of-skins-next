"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

interface AppHeaderNavLinkProps {
  href: string;
  children: string;
}

const AppHeaderNavLink: FC<AppHeaderNavLinkProps> = ({ href, children }) => {
  const pathname = usePathname();

  return (
    <NavigationMenuItem>
      <NavigationMenuLink data-active={pathname.startsWith(href)} asChild className={navigationMenuTriggerStyle()}>
        <Link href={href}>{children}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

export default AppHeaderNavLink;
