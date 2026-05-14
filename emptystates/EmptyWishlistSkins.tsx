"use client"
import { SearchIcon, ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import { useT } from "next-i18next/client";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

const EmptyWishlistSkins = () => {
  const { t } = useT("emptystate");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShoppingBagIcon />
        </EmptyMedia>
        <EmptyTitle>{t("wishlistNoSkins.title")}</EmptyTitle>
        <EmptyDescription>{t("wishlistNoSkins.description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button asChild>
          <Link href="/search/skins">
            <SearchIcon />
            {t("wishlistNoSkins.goToSkins")}
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default EmptyWishlistSkins;
