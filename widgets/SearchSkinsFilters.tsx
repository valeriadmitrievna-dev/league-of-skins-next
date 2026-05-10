"use client";
import { orderBy } from "lodash";
import { useT } from "next-i18next/client";
import { type FC } from "react";

import useChampions from "@/api/useChampions";
import useChromasUnique from "@/api/useChromasUnique";
import useRarities from "@/api/useRarities";
import useSkinlines from "@/api/useSkinlines";
import ChromaColor from "@/components/ChromaColor";
import { cn } from "@/shared/cn";
import { RARITIES } from "@/shared/constants/rarities";
import { useAuth } from "@/shared/providers/AuthProvider";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";

import FilterList from "./Filters/FilterList";
import FilterPanelTitle from "./Filters/FilterPanelTitle";
import FilterToggleGroup from "./Filters/FilterToggleGroup";

type SearchSkinsParam = "owned" | "legacy" | "championId" | "rarity" | "skinlineId" | "chromaId" | "server";

interface SearchFiltersProps {
  getValue: (key: SearchSkinsParam) => string | null;
  setValue: (key: SearchSkinsParam, value?: string | null) => void;
  count?: number;
  loading?: boolean;
  reset?: () => void;
  className?: string;
}

const SearchSkinsFilters: FC<SearchFiltersProps> = ({ getValue, setValue, loading, reset, className, count }) => {
  const { t, i18n } = useT();
  const { isAuth } = useAuth();

  const langCode = getLanguageCode(i18n.language);

  const { data: champions = [], isLoading: isChampionsLoading } = useChampions();
  const { data: skinlines = [], isLoading: isSkinlinesLoading } = useSkinlines();
  const { data: rarities = [], isLoading: isRaritiesLoading } = useRarities();
  const { data: chromas = [], isLoading: isChromasLoading } = useChromasUnique(langCode);

  const legacyOptions = [
    { value: "all", label: t("filters.all") },
    { value: "on", label: t("filters.legacy-on") },
    { value: "off", label: t("filters.legacy-off") },
  ];

  const ownedOptions = [
    { value: "all", label: t("filters.all") },
    { value: "on", label: t("filters.owned-on") },
    { value: "off", label: t("filters.owned-off") },
  ];

  const serverOptions = [
    { value: "all", label: t("filters.all") },
    { value: "latest", label: t("filters.server-latest") },
    { value: "pbe", label: t("filters.server-pbe") },
  ];

  return (
    <div className={cn("h-fit", className)}>
      <FilterPanelTitle onReset={reset} className="h-11 mb-5" />
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          {isAuth && (
            <FilterToggleGroup
              value={getValue("owned") ?? "all"}
              onChange={(value) => setValue("owned", value)}
              options={ownedOptions}
              className="grid grid-cols-[20%_1fr_1fr]"
              disabled={loading}
            />
          )}
          <FilterToggleGroup
            value={getValue("legacy") ?? "all"}
            onChange={(value) => setValue("legacy", value)}
            options={legacyOptions}
            className="grid grid-cols-[20%_1fr_1fr]"
            disabled={loading}
          />
        </div>
        <FilterToggleGroup
          value={getValue("server") ?? "all"}
          onChange={(value) => setValue("server", value)}
          options={serverOptions}
          className="grid grid-cols-[20%_1fr_1fr]"
          label={t("filters.server-label")}
          disabled={loading}
        />
        <FilterList
          options={orderBy(champions, "name").map((i) => ({ value: String(i.id), label: i.name }))}
          value={getValue("championId")}
          onChange={(value) => setValue("championId", value)}
          label={t("filters.champion")}
          loading={isChampionsLoading}
          disabled={loading}
        />
        <FilterList
          options={rarities.map((i) => ({
            value: i,
            label: t(`rarity.${i}`),
            prefix: <span className="block rounded-sm size-3" style={{ background: RARITIES[i]?.color }} />,
          }))}
          value={getValue("rarity")}
          onChange={(value) => setValue("rarity", value)}
          label={t("filters.rarity")}
          loading={isRaritiesLoading}
          disabled={loading}
        />
        <FilterList
          options={orderBy(skinlines, "name").map((i) => ({ value: String(i.id), label: i.name }))}
          value={getValue("skinlineId")}
          onChange={(value) => setValue("skinlineId", value)}
          label={t("filters.skinline")}
          loading={isSkinlinesLoading}
          disabled={loading}
        />
        <FilterList
          options={orderBy(chromas, "name").map((i) => ({
            value: i.id,
            label: i.name,
            prefix: <ChromaColor colors={i.colors} className="size-5 rounded-sm border-none" />,
          }))}
          value={getValue("chromaId")}
          onChange={(value) => setValue("chromaId", value)}
          label={t("filters.chroma")}
          loading={isChromasLoading}
          disabled={loading}
        />
        {!!count && !loading && (
          <p className="block text-sm text-muted-foreground">
            {t("filters.found_count", { count })} <span className="font-medium">{count}</span> {t("shared.skin", { count })}
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchSkinsFilters;
