"use client";
import { useT } from "next-i18next/client";
import { useCallback } from "react";

import Search from "@/components/Search";
import { Spinner } from "@/components/ui/spinner";
import EmptyCollectionSkins from "@/emptystates/EmptyCollectionSkins";
import useInfiniteLoad from "@/hooks/useInfiniteLoad";
import { BREAKPOINTS } from "@/shared/constants/styles";
import { AppDataSkin } from "@/types/appdata";
import SkinCard from "@/widgets/Skin/SkinCard";
import VirtualizedGrid from "@/widgets/VirtualizedGrid";

const CollectionPage = () => {
  const { i18n } = useT();

  const { data, isLoading, isFetching, loaderRef, count, initialized } = useInfiniteLoad({
    url: "/api/user/collection/skins",
    queryKey: ["collectionSkins", i18n.language],
    params: {
      // ...(search ? { search } : {}),
    },
  });

  const renderItem = useCallback((item: unknown, _index: number) => {
    const skin = item as AppDataSkin;
    return (
      <SkinCard
        key={skin.id}
        data={skin}
        owned="hidden"
        // toggleOwnedButton={user?.is_verified}
      />
    );
  }, []);

  return (
    <div className="pb-10 flex flex-col h-full grow">
      {!(initialized && !isLoading && !data.length && !count) && (
        <div className="mb-5 flex flex-col">
          <Search />
          <div className='grid grid-cols-4'></div>
        </div>
      )}
      {initialized && !isLoading && !data.length && !count && <EmptyCollectionSkins />}
      <VirtualizedGrid
        items={data}
        loading={!initialized && isLoading}
        fetching={isFetching}
        overscan={4}
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
      {!!data.length && isLoading && <Spinner className="mx-auto mt-4 size-8" />}
      <div ref={loaderRef} />
    </div>
  );
};

export default CollectionPage;
