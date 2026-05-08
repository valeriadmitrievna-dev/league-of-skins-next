import { SearchIcon, CircleQuestionMarkIcon, HeartIcon, PanelRightCloseIcon, Package2Icon, InfoIcon, UserRoundIcon } from "lucide-react";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { getT } from "next-i18next/server";
import { FC } from "react";

import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { verifyAccessToken } from "@/lib/auth";

import AppNavigationLink from "./AppNavigationLink";

const AppNavigation: FC = async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const { t } = await getT();

  const pathname = headerStore.get("x-pathname") ?? "/";
  const accessToken = cookieStore.get("accessToken")?.value;
  const isAuth = !!verifyAccessToken(accessToken ?? "");

  const authLink = (type: "signin" | "signup") => {
    return `/auth/${type}${pathname === "/" ? "" : "?redirect=" + pathname}`;
  };

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
        {isAuth && (
          <>
            <AppNavigationLink
              icon={<Package2Icon />}
              title={t("header.collection")}
              group={[
                { href: "/collection/dashboard", title: t("header.dashboard") },
                { href: "/collection", title: t("header.collection") },
              ]}
            />
            <AppNavigationLink
              icon={<HeartIcon />}
              group={[
                { href: "/wishlists", title: t("header.wishlists-my") },
                { href: "/wishlists/subscriptions", title: t("header.wishlists-subscriptions") },
                { href: "/wishlists/search", title: t("header.wishlists-search") },
              ]}
            />
          </>
        )}
        {!isAuth && (
          <AppNavigationLink
            icon={<UserRoundIcon />}
            group={[
              { href: authLink("signin"), title: t("header.signin") },
              { href: authLink("signup"), title: t("header.signup") },
            ]}
          />
        )}
      </div>
      <div className="flex flex-col items-center gap-2 mt-auto">
        <AppNavigationLink icon={<InfoIcon />} title={t("header.about")} href="/about" />
        {isAuth && <LogoutButton />}
        <Button size="icon-xl" variant="ghost" className="text-muted-foreground">
          <PanelRightCloseIcon />
        </Button>
      </div>
    </aside>
  );
};

export default AppNavigation;
