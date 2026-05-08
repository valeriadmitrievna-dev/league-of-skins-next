import { BookmarkXIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useT } from "next-i18next/client";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

const EmptyWishlistGuest = () => {
  const { t } = useT("emptystate");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookmarkXIcon />
        </EmptyMedia>
        <EmptyTitle>{t("guestWishlistNotFound.title")}</EmptyTitle>
        <EmptyDescription>{t("guestWishlistNotFound.description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button asChild>
          <Link href="/wishlists/search">
            <SearchIcon />
            {t("guestWishlistNotFound.goToWishlists")}
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default EmptyWishlistGuest;
