"use client";
import useInfiniteLoad from "@/hooks/useInfiniteLoad";
import { FC } from "react";
import VirtualizedGrid from "../VirtualizedGrid";
import { Spinner } from "@/components/ui/spinner";
import SkinCard from "../SkinCard";
import { SearchParams } from "@/shared/types";
import { useLocale } from '@/shared/providers/DictionaryProvider';

interface SearchSkinsResultProps {
  params: SearchParams;
}

const SearchSkinsResult: FC<SearchSkinsResultProps> = ({ params }) => {
  const locale = useLocale();
  const { search, championId, rarity, skinlineId, chromaId, legacy, owned, server } = params;

  const { data, isLoading, loaderRef } = useInfiniteLoad({
    url: "/api/skins",
    params: {
      ...(search ? { search } : {}),
      ...(championId ? { championId } : {}),
      ...(skinlineId ? { skinlineId } : {}),
      ...(rarity ? { rarity } : {}),
      ...(chromaId ? { chromaId } : {}),
      legacy: legacy || "all",
      owned: owned || "all",
      server: server || "all",
    },
    headers: { Language: locale },
  });

  const renderItem = (item: unknown, _index: number) => {
    const skin = item as any;
    return <SkinCard key={skin.id} data={skin} />;
  };

  return (
    <>
      {!isLoading && !data.length && "No items"}
      {!!data.length && (
        <VirtualizedGrid
          items={data}
          loading={!data.length && isLoading}
          overscan={4}
          render={renderItem}
          columnGap={16}
          rowGap={24}
        />
      )}
      {!!data.length && isLoading && <Spinner className="mx-auto mt-4 size-8" />}
      <div ref={loaderRef} />
    </>
  );
};

export default SearchSkinsResult;
