import { SearchXIcon, XIcon } from "lucide-react";
import { useT } from "next-i18next/client";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface EmptyColorSchemesNotFoundProps {
  onClearFilters?: () => void;
  onClearSearch?: () => void;
}

const EmptySearchChromas = ({ onClearFilters, onClearSearch }: EmptyColorSchemesNotFoundProps) => {
  const { t } = useT("emptystate");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchXIcon />
        </EmptyMedia>
        <EmptyTitle>{t("colorSchemesNotFound.title")}</EmptyTitle>
        <EmptyDescription>{t("colorSchemesNotFound.description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        {onClearFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            <XIcon />
            {t("colorSchemesNotFound.clearFilters")}
          </Button>
        )}
        {onClearSearch && (
          <Button variant="outline" onClick={onClearSearch}>
            <XIcon />
            {t("colorSchemesNotFound.clearSearch")}
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
};

export default EmptySearchChromas;
