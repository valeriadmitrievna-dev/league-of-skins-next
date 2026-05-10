"use client";
import { BrickWallShieldIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { config } from "@/lib/config";
import { cn } from "@/shared/cn";

const AdminNavLink = () => {
  const pathname = usePathname();

  if (config.nodeEnv === "development") {
    return (
      <HoverCard openDelay={100} closeDelay={0}>
        <HoverCardTrigger asChild>
          <Button size="icon-xl" variant="ghost" className={cn({ "text-primary!": pathname.startsWith('/administration') })}>
            <BrickWallShieldIcon />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent side="right" align="end" sideOffset={0} alignOffset={-10} className="pl-2 border-none! bg-transparent! shadow-none ring-0">
          <div className="p-2 rounded-lg bg-popover flex flex-col shadow-lg/80">
            <Button
              variant="ghost"
              size="lg"
              asChild
              className={cn("justify-start", {
                "text-primary!": pathname === "/administration/appdata",
              })}
            >
              <Link href="/administration/appdata">App Data</Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              asChild
              className={cn("justify-start", {
                "text-primary!": pathname === "/administration/test",
              })}
            >
              <Link href="/administration/test">Test</Link>
            </Button>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return null;
};

export default AdminNavLink;
