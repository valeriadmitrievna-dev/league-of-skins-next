import { SearchIcon, HeartIcon, PanelRightCloseIcon, Package2Icon, InfoIcon, UserRoundIcon, BoltIcon } from "lucide-react";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { getT } from "next-i18next/server";
import { FC } from "react";

import LogoIcon from '@/assets/logo.svg';
import { Button } from "@/components/ui/button";
import { verifyAccessToken } from "@/lib/auth";

import AppNavigationLink from "./AppNavigationLink";
import AdminNavLink from '../Admin/AdminNavLink';
import LanguageSwitcher from '../LanguageSwitcher';

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
    <aside className="fixed top-0 bottom-0 w-(--navigation-size) bg-background border-r flex flex-col items-center gap-6 py-5 overflow-hidden">
      <Link href="/">
        <LogoIcon className="size-10 text-primary" />
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
        <LanguageSwitcher />
        <AppNavigationLink icon={<InfoIcon />} title={t("header.about")} href="/about" />
        {isAuth && (
          <Button size="icon-xl" variant="ghost">
            <BoltIcon />
          </Button>
        )}
        <AdminNavLink />
        <Button size="icon-xl" variant="ghost" className="text-muted-foreground mt-4">
          <PanelRightCloseIcon />
        </Button>
      </div>
    </aside>
  );
};

export default AppNavigation;
