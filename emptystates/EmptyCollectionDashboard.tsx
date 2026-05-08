import { ChartNoAxesColumnIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useT } from "next-i18next/client";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

const EmptyCollectionDashboard = () => {
  const { t } = useT("emptystate");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ChartNoAxesColumnIcon />
        </EmptyMedia>
        <EmptyTitle>{t("statsEmpty.title")}</EmptyTitle>
        <EmptyDescription>{t("statsEmpty.description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button variant="outline" asChild>
          <Link href="/search/skins">
            <SearchIcon />
            {t("statsEmpty.goToSkins")}
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/search/chromas">
            <SearchIcon />
            {t("statsEmpty.goToColorSchemes")}
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default EmptyCollectionDashboard;
