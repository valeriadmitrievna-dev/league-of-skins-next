"use client";
import { useT } from "next-i18next/client";
import { FC, useCallback } from "react";

import useUser from "@/api/useUser";
import ScrollTopButton from "@/components/ScrollTopButton";
import Search from "@/components/Search";
import { Spinner } from "@/components/ui/spinner";
import useInfiniteLoad from "@/hooks/useInfiniteLoad";
import { useQueryParams } from "@/hooks/useQueryParams";
import { AppDataSkin } from "@/types/appdata";
import EmailVerificationBanner from "@/widgets/EmailVerificationBanner";
import SearchSkinsFilters from "@/widgets/SearchSkinsFilters";
import SkinCard from "@/widgets/Skin/SkinCard";
import VirtualizedGrid from "@/widgets/VirtualizedGrid";

const SearchSkins: FC = () => {
  const { i18n } = useT();
  const { get: getSearch, update: updateSearch } = useQueryParams();
  const { get, update, reset, hasActive } = useQueryParams(["owned", "legacy", "championId", "rarity", "skinlineId", "chromaId", "server"]);

  const search = getSearch("search");
  const championId = get("championId");
  const skinlineId = get("skinlineId");
  const rarity = get("rarity");
  const chromaId = get("chromaId");
  const legacy = get("legacy");
  const owned = get("owned");
  const server = get("server");

  const { data: user } = useUser();
  const { data, isLoading, isFetching, loaderRef, count, initialized } = useInfiniteLoad({
    url: "/api/skins",
    queryKey: ["skins", i18n.language],
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
  });

  const renderItem = useCallback(
    (item: unknown, _index: number) => {
      const skin = item as AppDataSkin;
      const ownedSkins = user?.owned_skins ?? [];
      return (
        <SkinCard
          key={skin.id}
          data={skin}
          owned={ownedSkins.includes(skin.contentId)}
          toggleOwnedButton={user?.is_verified}
          addToWishlistButton={user?.is_verified}
        />
      );
    },
    [user],
  );

  return (
    <div className="w-full md:grid grid-cols-[280px_1fr] gap-6">
      <SearchSkinsFilters getValue={get} setValue={update} {...(hasActive ? { reset } : {})} loading={isLoading || isFetching} count={count} />
      <div className="pb-10">
        {!!user && !user.is_verified && <EmailVerificationBanner className="mb-3" />}
        <Search value={search ?? ""} onSearch={(value) => updateSearch("search", value)} className="mb-4" />
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
      </div>
      <ScrollTopButton />
    </div>
  );
};

export default SearchSkins;
