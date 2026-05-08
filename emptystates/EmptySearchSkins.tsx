import { SearchXIcon } from "lucide-react";
import { useT } from "next-i18next/client";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface EmptySkinsNotFoundProps {
  onClearFilters?: (() => void) | false;
  onClearSearch?: (() => void) | false;
}

const EmptySearchSkins = ({ onClearFilters, onClearSearch }: EmptySkinsNotFoundProps) => {
  const { t } = useT("emptystate");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchXIcon />
        </EmptyMedia>
        <EmptyTitle>{t("skinsNotFound.title")}</EmptyTitle>
        <EmptyDescription>{t("skinsNotFound.description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        {onClearFilters && (
          <Button variant="outline" size="md" onClick={onClearFilters}>
            {t("skinsNotFound.clearFilters")}
          </Button>
        )}
        {onClearSearch && (
          <Button variant="outline" size="md" onClick={onClearSearch}>
            {t("skinsNotFound.clearSearch")}
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
};

export default EmptySearchSkins;
