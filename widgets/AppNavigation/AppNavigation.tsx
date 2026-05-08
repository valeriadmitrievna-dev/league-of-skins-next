import { SearchIcon, CircleQuestionMarkIcon, HeartIcon, PanelRightCloseIcon, Package2Icon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { getT } from "next-i18next/server";
import { FC } from "react";

import { Button } from "@/components/ui/button";

import AppNavigationLink from "./AppNavigationLink";

const AppNavigation: FC = async () => {
  const { t } = await getT();

  return (
    <aside className="fixed top-0 bottom-0 w-(--navigation-size) bg-background border-r flex flex-col items-center gap-8 py-5 overflow-hidden">
      <Link href="/">
        <CircleQuestionMarkIcon className="size-8" />
      </Link>
      <div className="flex flex-col items-center gap-2">
        <AppNavigationLink
          icon={<SearchIcon />}
          title={t("header.search")}
          group={[
            { href: "/search/skins", title: t("header.skins") },
            { href: "/search/chromas", title: t("header.chromas") },
          ]}
        />
        <AppNavigationLink
          icon={<Package2Icon />}
          title={t("header.collection")}
          group={[
            { href: "/collection/dashboard", title: "Dashboard" },
            { href: "/collection", title: t("header.collection") },
          ]}
        />
        <AppNavigationLink
          icon={<HeartIcon />}
          title={t("header.wishlists")}
          group={[
            { href: "/wishlists", title: t("header.wishlists") },
            { href: "/wishlists/subscriptions", title: t("header.wishlists") },
            { href: "/wishlists/search", title: t("header.wishlists") },
          ]}
        />
      </div>
      <div className="flex flex-col items-center gap-2 mt-auto">
        <AppNavigationLink icon={<InfoIcon />} title={t("header.about")} href="/about" />
        <Button size="icon-xl" variant="ghost">
          <PanelRightCloseIcon />
        </Button>
      </div>
    </aside>
  );
};

export default AppNavigation;
