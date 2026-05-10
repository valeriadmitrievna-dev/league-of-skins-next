"use client";
import { useQuery } from "@tanstack/react-query";
import { useT } from "next-i18next/client";
import { FC, useCallback } from "react";

import ScrollTopButton from "@/components/ScrollTopButton";
import Search from '@/components/Search';
import EmptyCollectionSkins from '@/emptystates/EmptyCollectionSkins';
import { fetchClient } from "@/lib/fetchClient";
import { BREAKPOINTS } from "@/shared/constants/styles";
import { ODataResponse } from "@/shared/types";
import { AppDataSkin } from "@/types/appdata";
import CollectionTabs from '@/widgets/Collection/CollectionTabs';
import SkinCard from "@/widgets/Skin/SkinCard";
import VirtualizedGrid from "@/widgets/VirtualizedGrid";

const CollectionSkinsPage: FC = () => {
  const { i18n } = useT();

  const { data, isLoading } = useQuery({
    queryKey: ["collectionSkins", i18n.language],
    queryFn: () => fetchClient<ODataResponse<AppDataSkin[]>>("/api/user/collection/skins"),
    staleTime: 0,
  });

  const renderItem = useCallback((item: unknown, _index: number) => {
    const skin = item as AppDataSkin;
    return <SkinCard key={skin.id} data={skin} owned="hidden" />;
  }, []);

  return (
    <>
      <div className="flex items-stretch gap-x-3">
        <CollectionTabs className="w-75 p-1" />
        <Search />
      </div>
      {!data?.data.length && !isLoading && <EmptyCollectionSkins className='h-full' />}
      <VirtualizedGrid
        items={data?.data ?? []}
        overscan={4}
        loading={isLoading}
        render={renderItem}
        columnGap={16}
        rowGap={24}
        responsiveColumns={[
          { minWidth: BREAKPOINTS["4xl"], columns: 7 },
          { minWidth: BREAKPOINTS["3xl"], columns: 6 },
          { minWidth: BREAKPOINTS["2xl"], columns: 5 },
          { minWidth: BREAKPOINTS.xl, columns: 4 },
          { minWidth: BREAKPOINTS.lg, columns: 3 },
          { minWidth: BREAKPOINTS.md, columns: 2 },
          { minWidth: 0, columns: 2 },
        ]}
      />
      <ScrollTopButton />
    </>
  );
};

export default CollectionSkinsPage;
