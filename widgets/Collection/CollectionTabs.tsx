"use client";

import { usePathname, useRouter } from "next/navigation";
import { useT } from "next-i18next/client";
import { FC } from "react";

import { OptionItem, WithClassName } from "@/shared/types";

import FilterToggleGroup from "../Filters/FilterToggleGroup";

const CollectionTabs: FC<WithClassName> = ({ className }) => {
  const { t } = useT();
  const pathname = usePathname();
  const router = useRouter();

  const options: OptionItem[] = [
    { value: "skins", label: t("header.skins") },
    { value: "chromas", label: t("header.chromas") },
  ];

  const tabChangeHandler = (v?: string) => {
    if (v && v !== pathname.split("/")[2]) {
      router.push(`/collection/${v}`);
    }
  };

  return (
    <FilterToggleGroup value={pathname.split("/")[2]} onChange={tabChangeHandler} options={options} className={className} />
  );
};

export default CollectionTabs;
