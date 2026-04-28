"use client";
import useInfiniteLoad from "@/hooks/useInfiniteLoad";
import { FC } from "react";
import VirtualizedGrid from "../VirtualizedGrid";
import { Spinner } from "@/components/ui/spinner";
import { useQueryParams } from "@/hooks/useQueryParams";

const SearchSkinsResult: FC = () => {
  const { get } = useQueryParams();

  const search = get("search");
  const championId = get("championId");
  const rarity = get("rarity");
  const skinlineId = get("skinlineId");
  const chromaId = get("chromaId");
  const legacy = get("legacy");
  const owned = get("owned");
  const server = get("server");

  const { data, isLoading, loaderRef } = useInfiniteLoad({
    url: "/api/skins",
    params: {
      lang: "ru",
      ...(search ? { search } : {}),
      ...(championId ? { championId } : {}),
      ...(skinlineId ? { skinlineId } : {}),
      ...(rarity ? { rarity } : {}),
      ...(chromaId ? { chromaId } : {}),
      legacy: legacy || "all",
      owned: owned || "all",
      server: server || "all",
    },
  });

  const renderItem = (item: unknown, _index: number) => {
    const skin = item as any;
    return <div className="w-full h-90 bg-card">{skin.name}</div>;
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
