import { BookmarkXIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { getT } from "next-i18next/server";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

const EmptyWishlistsSubscriptions = async () => {
  const { t } = await getT("emptystate");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookmarkXIcon />
        </EmptyMedia>
        <EmptyTitle>{t("subscribedWishlistsNotFound.title")}</EmptyTitle>
        <EmptyDescription>{t("subscribedWishlistsNotFound.description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button asChild>
          <Link href="/wishlists/search">
            <SearchIcon />
            {t("subscribedWishlistsNotFound.goToWishlists")}
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default EmptyWishlistsSubscriptions;