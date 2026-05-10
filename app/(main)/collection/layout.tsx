import { getT } from "next-i18next/server";
import { FC, PropsWithChildren } from "react";

import { Typography } from "@/components/Typography";
import UploadInventory from "@/widgets/UploadInventory/UploadInventory";

const CollectionLayout: FC<PropsWithChildren> = async ({ children }) => {
  const { t } = await getT();

  return (
    <div className="flex flex-col h-full gap-y-4">
      <div className="flex items-center justify-between">
        <Typography.H2>{t("header.collection")}</Typography.H2>
        <UploadInventory />
      </div>
      {children}
    </div>
  );
};

export default CollectionLayout;
