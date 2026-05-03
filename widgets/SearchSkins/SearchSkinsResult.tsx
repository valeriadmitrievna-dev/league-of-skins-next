"use client";
import useInfiniteLoad from "@/hooks/useInfiniteLoad";
import { FC, useCallback, useEffect } from "react";
import VirtualizedGrid from "../VirtualizedGrid";
import { Spinner } from "@/components/ui/spinner";
import SkinCard from "../Skin/SkinCard";
import { SearchParams } from "@/shared/types";

import { useUser } from "@/shared/providers/UserProvider";
import { useT } from "next-i18next/client";
import { useApp } from "@/shared/providers/AppProvider";

interface SearchSkinsResultProps {
  params: SearchParams;
}

const SearchSkinsResult: FC<SearchSkinsResultProps> = ({ params }) => {
  const { i18n } = useT();
  const locale = i18n.language;

  const { user } = useUser();
  const { setSkinsCount } = useApp();
  const { search, championId, rarity, skinlineId, chromaId, legacy, owned, server } = params;

  const { data, isLoading, isFetching, loaderRef, count, initialized } = useInfiniteLoad({
    url: "/api/skins",
    queryKey: ["skins"],
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

  const renderItem = useCallback(
    (item: unknown, _index: number) => {
      const skin = item as any;
      const ownedSkins = user?.ownedSkins as string[] | undefined;
      return (
        <SkinCard
          key={skin.id}
          data={skin}
          owned={ownedSkins?.includes(skin.contentId)}
          toggleOwnedButton
          addToWishlistButton
        />
      );
    },
    [user],
  );

  useEffect(() => {
    setSkinsCount(count);
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

export default SearchSkinsResult;
