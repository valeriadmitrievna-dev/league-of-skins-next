"use client";
import { orderBy } from "lodash";
import { useT } from "next-i18next/client";
import { useCallback, useState } from "react";

import useChampions from "@/api/useChampions";
import useRarities from "@/api/useRarities";
import useSkinlines from "@/api/useSkinlines";
import Search from "@/components/Search";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import EmptyCollectionSkins from "@/emptystates/EmptyCollectionSkins";
import useInfiniteLoad from "@/hooks/useInfiniteLoad";
import { useQueryParams } from "@/hooks/useQueryParams";
import { RARITIES } from "@/shared/constants/rarities";
import { BREAKPOINTS } from "@/shared/constants/styles";
import { AppDataSkin } from "@/types/appdata";
import FilterList from "@/widgets/Filters/FilterList";
import SkinCard from "@/widgets/Skin/SkinCard";
import UploadInventory from "@/widgets/UploadInventory/UploadInventory";
import VirtualizedGrid from "@/widgets/VirtualizedGrid";

const CollectionPage = () => {
  const { t, i18n } = useT();
  const { get, update } = useQueryParams(["search", "championId", "skinlineId", "rarity"]);

  const [tab, setTab] = useState<"skins" | "chromas">("skins");

  const search = get("search");
  const championId = get("championId");
  const skinlineId = get("skinlineId");
  const rarity = get("rarity");

  const { data: champions = [], isLoading: isChampionsLoading } = useChampions(true);
  const { data: skinlines = [], isLoading: isSkinlinesLoading } = useSkinlines(true);
  const { data: rarities = [], isLoading: isRaritiesLoading } = useRarities(true);

  const { data, isLoading, isFetching, loaderRef, count, initialized } = useInfiniteLoad({
    url: "/api/user/collection/skins",
    queryKey: ["collectionSkins", i18n.language],
    params: {
      ...(search ? { search } : {}),
      ...(championId ? { championId } : {}),
      ...(skinlineId ? { skinlineId } : {}),
      ...(rarity ? { rarity } : {}),
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

  const tabChangeHandler = (v: string) => {
    if (v !== tab) {
      setTab(v as "skins" | "chromas");
    }
  };

  return (
    <div className="pb-10 flex flex-col h-full grow">
      {!(initialized && !isLoading && !data.length && !count) && (
        <div className="mb-4 flex flex-col gap-y-4">
          <Search
            disabled={isLoading || isFetching}
            addon={
              <Select value={tab} onValueChange={tabChangeHandler} variant="primary">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" align="end">
                  <SelectGroup>
                    <SelectItem value="skins">{t("header.skins")}</SelectItem>
                    <SelectItem value="chromas">{t("header.chromas")}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            }
          />
          <div className="flex items-center gap-4">
            <FilterList
              options={orderBy(champions, "name").map((i) => ({ value: String(i.id), label: i.name }))}
              value={championId}
              onChange={(value) => update("championId", value)}
              placeholder={t("filters.searchBy_champion")}
              loading={isChampionsLoading}
              disabled={isLoading || isFetching}
              className="max-w-69.5"
            />
            <FilterList
              options={orderBy(skinlines, "name").map((i) => ({ value: String(i.id), label: i.name }))}
              value={skinlineId}
              onChange={(value) => update("skinlineId", value)}
              placeholder={t("filters.searchBy_skinline")}
              loading={isSkinlinesLoading}
              disabled={isLoading || isFetching}
              className="max-w-69.5"
            />
            <FilterList
              options={rarities.map((i) => ({
                value: i,
                label: t(`rarity.${i}`),
                prefix: <span className="block rounded-sm size-3" style={{ background: RARITIES[i]?.color }} />,
              }))}
              value={get("rarity")}
              onChange={(value) => update("rarity", value)}
              placeholder={t("filters.searchBy_rarity")}
              loading={isRaritiesLoading}
              disabled={isLoading || isFetching}
              className="max-w-69.5"
            />
            <UploadInventory className="ml-auto" />
          </div>
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
