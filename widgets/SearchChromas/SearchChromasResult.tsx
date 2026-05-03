"use client";
import useInfiniteLoad from "@/hooks/useInfiniteLoad";
import { FC, useCallback, useEffect } from "react";
import VirtualizedGrid from "../VirtualizedGrid";
import { Spinner } from "@/components/ui/spinner";
import { SearchParams } from "@/shared/types";
import ChromaCard from "../ChromaCard";
import { useT } from "next-i18next/client";
import { useApp } from "@/shared/providers/AppProvider";
import { useUser } from "@/shared/providers/UserProvider";

interface SearchChromasResultProps {
  params: SearchParams;
}

const SearchChromasResult: FC<SearchChromasResultProps> = ({ params }) => {
  const { i18n } = useT();
  const locale = i18n.language;

  const { user } = useUser();
  const { setChromasCount } = useApp();
  const { search, championId, skinContentId, skin, owned, server } = params;

  const { data, isLoading, isFetching, loaderRef, count, initialized } = useInfiniteLoad({
    url: "/api/skins",
    queryKey: ["skins"],
    params: {
      ...(search ? { search } : {}),
      ...(championId ? { championId } : {}),
      ...(skinContentId ? { skinContentId } : {}),
      skin: skin || "all",
      owned: owned || "all",
      server: server || "all",
    },
    headers: { Language: locale },
  });

  const renderItem = useCallback(
    (item: unknown, _index: number) => {
      const chroma = item as any;
      const ownedChromas = (user?.ownedChromas as string[]) ?? [];
      return (
        <ChromaCard
          key={chroma.id}
          data={chroma}
          owned={ownedChromas?.includes(chroma.contentId)}
          toggleOwnedButton
          addToWishlistButton
        />
      );
    },
    [user],
  );

  useEffect(() => {
    setChromasCount(count);
  }, [count]);

  return (
    <>
      {initialized && !isLoading && !data.length && "No items"}
      <VirtualizedGrid
        items={data}
        loading={!initialized && isLoading}
        fetching={isFetching}
        overscan={4}
        render={renderItem}
        columnGap={16}
        rowGap={24}
      />
      {!!data.length && isLoading && <Spinner className="mx-auto mt-4 size-8" />}
      <div ref={loaderRef} />
    </>
  );
};

export default SearchChromasResult;
