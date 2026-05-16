"use client";
import { HeartIcon } from "lucide-react";
import { useT } from "next-i18next/client";
import { type FC, useCallback } from "react";

import useUser from "@/api/useUser";
import useUserOwned from "@/api/useUserOwned";
import useUserWishlists from "@/api/useUserWishlists";
import ScrollTopButton from "@/components/ScrollTopButton";
import Search from "@/components/Search";
import { Spinner } from "@/components/ui/spinner";
import EmptySearchSkins from "@/emptystates/EmptySearchSkins";
import useInfiniteLoad from "@/hooks/useInfiniteLoad";
import { useQueryParams } from "@/hooks/useQueryParams";
import { cn } from "@/shared/cn";
import { useAuth } from "@/shared/providers/AuthProvider";
import { AppDataSkin } from "@/types/appdata";
import EmailVerificationBanner from "@/widgets/EmailVerificationBanner";
import SearchSkinsFilters from "@/widgets/SearchSkinsFilters";
import SkinCard from "@/widgets/Skin/SkinCard";
import VirtualizedGrid from "@/widgets/VirtualizedGrid";
import WishlistDialog from "@/widgets/Wishlist/WishlistDialog";

type SearchSkinsParam = "search" | "owned" | "legacy" | "championId" | "rarity" | "skinlineId" | "chromaId" | "server";

const SearchSkins: FC = () => {
  const { i18n } = useT();
  const { get, update, reset, hasActive } = useQueryParams<SearchSkinsParam>([
    "owned",
    "legacy",
    "championId",
    "rarity",
    "skinlineId",
    "chromaId",
    "server",
  ]);

  const search = get("search");
  const championId = get("championId");
  const skinlineId = get("skinlineId");
  const rarity = get("rarity");
  const chromaId = get("chromaId");
  const legacy = get("legacy");
  const owned = get("owned");
  const server = get("server");

  const { isAuth } = useAuth();
  const { data: user } = useUser(isAuth);
  const { data: userOwned } = useUserOwned(isAuth);
  const { data: wishlists = [] } = useUserWishlists(isAuth);

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

  const allWishlistSkins = wishlists.flatMap((w) => w.skins);

  const renderItem = useCallback(
    (item: unknown, _index: number) => {
      const skin = item as AppDataSkin;
      const isOwned = (userOwned?.ownedSkinIds ?? []).includes(skin.contentId);
      const isSkinInWishlist = allWishlistSkins.includes(skin.contentId);

      return (
        <SkinCard
          key={skin.id}
          data={skin}
          owned={isOwned}
          actions={
            <WishlistDialog
                skinName={skin.name}
                skinContentIds={[skin.contentId]}
                trigger={({ onOpen }) => (
                  <HeartIcon
                    role="button"
                    onClick={onOpen}
                    className={cn("size-7 p-1 pr-0 text-destructive shrink-0 select-none", {
                      "fill-destructive": isSkinInWishlist,
                      "hover:fill-destructive/50": !isSkinInWishlist,
                      "pointer-events-none opacity-50": !user?.is_verified,
                    })}
                  />
                )}
              />
          }
        />
      );
    },
    [user, userOwned, allWishlistSkins],
  );

  return (
    <div className="w-full md:grid grid-cols-[300px_1fr] gap-6">
      <SearchSkinsFilters
        getValue={get}
        setValue={update}
        {...(hasActive ? { reset } : {})}
        loading={isLoading || isFetching}
        count={count}
        className="sticky top-5"
      />
      <div className="pb-10">
        {!!user && !user.is_verified && <EmailVerificationBanner className="mb-3" />}
        <Search value={search ?? ""} onSearch={(value) => update("search", value)} className="mb-4" />
        {initialized && !isLoading && !data.length && (
          <EmptySearchSkins
            onClearFilters={hasActive && reset}
            onClearSearch={!!search && (() => update("search"))}
          />
        )}
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