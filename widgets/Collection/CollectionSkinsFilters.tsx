"use client";
import { FC } from "react";

import useChampions from '@/api/useChampions';

const CollectionSkinsFilters: FC = () => {
  const {} = useChampions(true);

  return (
    <div className="flex flex-col gap-y-3 py-2">
      <p>champion</p>
      <p>skinline</p>
      <p>rarity</p>
    </div>
  );
};

export default CollectionSkinsFilters;
