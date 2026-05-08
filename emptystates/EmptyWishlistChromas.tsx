import { PaletteIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { getT } from "next-i18next/server";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

const EmptyWishlistChromas = async () => {
  const { t } = await getT("emptystate");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PaletteIcon />
        </EmptyMedia>
        <EmptyTitle>{t("wishlistNoColorSchemes.title")}</EmptyTitle>
        <EmptyDescription>{t("wishlistNoColorSchemes.description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button asChild>
          <Link href="/search/chromas">
            <SearchIcon />
            {t("wishlistNoColorSchemes.goToColorSchemes")}
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default EmptyWishlistChromas;
