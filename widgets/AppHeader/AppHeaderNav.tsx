import { cookies, headers } from "next/headers";
import Link from "next/link";
import { getT } from "next-i18next/server";
import { type FC } from "react";

import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { verifyAccessToken } from '@/lib/auth';
import { getLangCookie } from '@/lib/cookies';
import { cn } from "@/shared/cn";

import AppHeaderLink from "./AppHeaderLink";
import AdminNavLink from "../Admin/AdminNavLink";
import LanguageSwitcher from "../LanguageSwitcher";

interface AppHeaderNavProps {
  className?: string;
}

const AppHeaderNav: FC<AppHeaderNavProps> = async ({ className }) => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const accessToken = cookieStore.get("accessToken")?.value;
  const isAuth = !!(verifyAccessToken(accessToken ?? ''));

  const pathname = headerStore.get("x-pathname") ?? "/";
  const lng = await getLangCookie();
  const { t } = await getT("common", { lng });

  const authLink = (type: "signin" | "signup") => {
    return `/auth/${type}${pathname === "/" ? "" : "?redirect=" + pathname}`;
  };

  return (
    <nav className={cn("flex items-center gap-2 lg:gap-4 h-full", className)}>
      <div className="flex flex-col md:flex-row items-center gap-8 shrink-0 h-full">
        <AppHeaderLink to="/search/skins" text={t("header.skins")} className="py-2" />
        <AppHeaderLink to="/search/chromas" text={t("header.chromas")} className="py-2" />
        {isAuth && (
          <>
            <AppHeaderLink to="/wishlists" text={t("header.wishlists")} className="w-full md:w-fit" />
            <AppHeaderLink to="/collection" text={t("header.collection")} className="w-full md:w-fit" />
          </>
        )}
        <AppHeaderLink to="/about" text={t("header.about")} className="w-full md:w-fit" />
      </div>

      <div className="flex flex-col md:flex-row w-full gap-2">
        <div className="flex gap-2 items-center justify-center md:ml-4">
          <LanguageSwitcher />
          <AdminNavLink />
          {/* {isAuth && <UserSettings />} */}
        </div>

        {!isAuth && (
          <>
            <Button variant="outline" asChild>
              <Link href={authLink("signup")}>{t("header.signup")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={authLink("signin")}>{t("header.signin")}</Link>
            </Button>
          </>
        )}
        {isAuth && <LogoutButton />}
      </div>
    </nav>
  );
};

export default AppHeaderNav;
