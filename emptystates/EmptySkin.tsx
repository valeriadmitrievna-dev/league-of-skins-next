import { FileQuestion, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useT } from "next-i18next/client";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

const EmptySkin = () => {
  const { t } = useT("emptystate");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileQuestion />
        </EmptyMedia>
        <EmptyTitle>{t("skinNotFound.title")}</EmptyTitle>
        <EmptyDescription>{t("skinNotFound.description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button asChild>
          <Link href="/search/skins">
            <SearchIcon />
            {t("skinNotFound.goToSearch")}
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default EmptySkin;
