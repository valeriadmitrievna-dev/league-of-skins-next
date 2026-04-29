"use client";
import useInfiniteLoad from "@/hooks/useInfiniteLoad";
import { FC } from "react";
import VirtualizedGrid from "../VirtualizedGrid";
import { Spinner } from "@/components/ui/spinner";
import SkinCard from "../SkinCard";
import { SearchParams } from "@/shared/types";
import ChromaCard from '../ChromaCard';

interface SearchChromasResultProps {
  params: SearchParams;
}

const SearchChromasResult: FC<SearchChromasResultProps> = ({ params }) => {
  const { search, championId, skinContentId, skin, owned, server } = params;

  const { data, isLoading, loaderRef } = useInfiniteLoad({
    url: "/api/chromas",
    params: {
      ...(search ? { search } : {}),
      ...(championId ? { championId } : {}),
      ...(skinContentId ? { skinContentId } : {}),
      skin: skin || "all",
      owned: owned || "all",
      server: server || "all",
    },
    headers: { Language: "ru" },
  });

  const renderItem = (item: unknown, _index: number) => {
    const chroma = item as any;
    return <ChromaCard key={chroma.id} data={chroma} />;
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

export default SearchChromasResult;
