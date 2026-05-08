import { PackageOpenIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { getT } from "next-i18next/server";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import UploadInventory from '@/widgets/UploadInventory/UploadInventory';

const EmptyCollectionSkins = async () => {
  const { t } = await getT("emptystate");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpenIcon />
        </EmptyMedia>
        <EmptyTitle>{t("collectionNoSkins.title")}</EmptyTitle>
        <EmptyDescription>{t("collectionNoSkins.description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <UploadInventory />
        <Button variant="outline" asChild>
          <Link href="/search/skins">
            <SearchIcon />
            {t("collectionNoSkins.goToSkins")}
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default EmptyCollectionSkins;
