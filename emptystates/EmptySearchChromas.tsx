import { SearchXIcon } from "lucide-react";
import { useT } from "next-i18next/client";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface EmptyColorSchemesNotFoundProps {
  onClearFilters?: (() => void) | false;
  onClearSearch?: (() => void) | false;
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
          <Button variant="outline" size="md" onClick={onClearFilters}>
            {t("colorSchemesNotFound.clearFilters")}
          </Button>
        )}
        {onClearSearch && (
          <Button variant="outline" size="md" onClick={onClearSearch}>
            {t("colorSchemesNotFound.clearSearch")}
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
};

export default EmptySearchChromas;
