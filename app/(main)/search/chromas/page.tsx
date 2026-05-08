"use client";
import { useT } from "next-i18next/client";
import { FC, useCallback } from "react";

import useUser from "@/api/useUser";
import ScrollTopButton from "@/components/ScrollTopButton";
import Search from "@/components/Search";
import { Spinner } from "@/components/ui/spinner";
import useInfiniteLoad from "@/hooks/useInfiniteLoad";
import { useQueryParams } from "@/hooks/useQueryParams";
import { AppDataChroma } from "@/types/appdata";
import ChromaCard from "@/widgets/ChromaCard";
import EmailVerificationBanner from "@/widgets/EmailVerificationBanner";
import SearchChromasFilters from "@/widgets/SearchChromasFilters";
import VirtualizedGrid from "@/widgets/VirtualizedGrid";

const SearchChromas: FC = () => {
  const { i18n } = useT();
  const { get: getSearch, update: updateSearch } = useQueryParams();
  const { get, update, updateMany, reset, hasActive } = useQueryParams(["owned", "skin", "championId", "skinContentId", "server"]);

  const search = getSearch("search");
  const championId = get("championId");
  const skinContentId = get("skinContentId");
  const skin = get("skin");
  const owned = get("owned");
  const server = get("server");

  const { data: user } = useUser();
  const { data, isLoading, isFetching, loaderRef, count, initialized } = useInfiniteLoad({
    url: "/api/chromas",
    queryKey: ["chromas", i18n.language],
    params: {
      ...(search ? { search } : {}),
      ...(championId ? { championId } : {}),
      ...(skinContentId ? { skinContentId } : {}),
      skin: skin || "all",
      owned: owned || "all",
      server: server || "all",
    },
  });

  const renderItem = useCallback(
    (item: unknown, _index: number) => {
      const chroma = item as AppDataChroma;
      const ownedChromas = user?.owned_chromas ?? [];
      return (
        <ChromaCard
          key={chroma.id}
          data={chroma}
          owned={ownedChromas.includes(chroma.contentId)}
          toggleOwnedButton={user?.is_verified}
          addToWishlistButton={user?.is_verified}
        />
      );
    },
    [user],
  );

  return (
    <div className="w-full md:grid grid-cols-[280px_1fr] gap-6">
      <SearchChromasFilters
        getValue={get}
        setValue={update}
        setValueMany={updateMany}
        {...(hasActive ? { reset } : {})}
        loading={isLoading || isFetching}
        count={count}
        className="sticky top-5"
      />
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

export default SearchChromas;
