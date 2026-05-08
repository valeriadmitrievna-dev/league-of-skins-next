import { XIcon,SearchXIcon } from "lucide-react";
import { getT } from "next-i18next/server";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface EmptyWishlistsSearchNotFoundProps {
  onClearSearch?: () => void;
}

const EmptyWishlistsSearch = async ({ onClearSearch }: EmptyWishlistsSearchNotFoundProps) => {
  const { t } = await getT("emptystate");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchXIcon />
        </EmptyMedia>
        <EmptyTitle>{t("wishlistsSearchNotFound.title")}</EmptyTitle>
        <EmptyDescription>{t("wishlistsSearchNotFound.description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button variant="outline" onClick={onClearSearch}>
          <XIcon />
          {t("wishlistsSearchNotFound.clearSearch")}
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default EmptyWishlistsSearch;
