import { PaintBucketIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useT } from "next-i18next/client";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

const EmptyCollectionChromas = () => {
  const { t } = useT("emptystate");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PaintBucketIcon />
        </EmptyMedia>
        <EmptyTitle>{t("collectionNoColorSchemes.title")}</EmptyTitle>
        <EmptyDescription>{t("collectionNoColorSchemes.description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button asChild>
          <Link href="/search/chromas">
            <SearchIcon />
            {t("collectionNoColorSchemes.goToColorSchemes")}
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default EmptyCollectionChromas;
