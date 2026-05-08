import { XIcon,SearchXIcon } from "lucide-react";
import { useT } from "next-i18next/client";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface EmptyWishlistsSearchNotFoundProps {
  onClearSearch?: () => void;
}

const EmptyWishlistsSearch = ({ onClearSearch }: EmptyWishlistsSearchNotFoundProps) => {
  const { t } = useT("emptystate");

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
