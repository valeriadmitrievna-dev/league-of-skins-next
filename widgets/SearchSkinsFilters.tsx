"use client";
import { orderBy } from "lodash";
import { useT } from "next-i18next/client";
import { type FC } from "react";

import useChampions from "@/api/useChampions";
import useChromasUnique from "@/api/useChromasUnique";
import useRarities from "@/api/useRarities";
import useSkinlines from "@/api/useSkinlines";
import ChromaColor from "@/components/ChromaColor";
import Skeleton from "@/components/Skeleton";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { cn } from "@/shared/cn";
import { RARITIES } from "@/shared/constants/rarities";
import { useUser } from "@/shared/providers/UserProvider";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";

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
  const { isAuth } = useUser();

  const langCode = getLanguageCode(i18n.language);

  const { data: champions = [], isLoading: isChampionsLoading } = useChampions(langCode);
  const { data: skinlines = [], isLoading: isSkinlinesLoading } = useSkinlines(langCode);
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
    <div className={cn("h-fit sticky top-4", className)}>
      <FilterPanelTitle onReset={reset} className="mb-4" />
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
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
        <Field className="gap-2">
          <Label className="text-primary/80">{t("filters.champion")}</Label>
          {isChampionsLoading ? (
            <Skeleton className="h-9" />
          ) : (
            <Combobox
              items={orderBy(champions, "name")}
              value={getValue("championId")}
              itemToStringLabel={(value: string) => champions.find((c) => c.id === value)?.name ?? value}
              onValueChange={(value) => setValue("championId", value)}
              disabled={loading}
            >
              <ComboboxInput placeholder={t("shared.search")} showClear disabled={loading} />
              <ComboboxContent className="p-1 py-2">
                <ComboboxEmpty>{t("shared.no-items-found")}</ComboboxEmpty>
                <ComboboxList className="scrollbar p-0 px-1">
                  {(item) => (
                    <ComboboxItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )}
        </Field>
        <Field className="gap-2">
          <Label className="text-primary/80">{t("filters.rarity")}</Label>
          {isRaritiesLoading ? (
            <Skeleton className="h-9" />
          ) : (
            <Combobox
              items={rarities}
              value={getValue("rarity")}
              itemToStringLabel={(value: string) => t(`rarity.${rarities.find((c) => c === value)}`)}
              onValueChange={(value) => setValue("rarity", value)}
              disabled={loading}
            >
              <ComboboxInput placeholder={t("shared.search")} showClear disabled={loading} />
              <ComboboxContent className="p-1 py-2 w-(--radix-popover-trigger-width)">
                <ComboboxEmpty>{t("shared.no-items-found")}</ComboboxEmpty>
                <ComboboxList className="scrollbar p-0 px-1">
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      <span className="block rounded-sm size-3" style={{ background: RARITIES[item]?.color }} />
                      {t(`rarity.${item}`)}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )}
        </Field>
        <Field className="gap-2">
          <Label className="text-primary/80">{t("filters.skinline")}</Label>
          {isSkinlinesLoading ? (
            <Skeleton className="h-9" />
          ) : (
            <Combobox
              items={orderBy(skinlines, "name")}
              value={getValue("skinlineId")}
              itemToStringLabel={(value: string) => skinlines.find((c) => c.id.toString() === value)?.name ?? value}
              onValueChange={(value) => setValue("skinlineId", value)}
              disabled={loading}
            >
              <ComboboxInput placeholder={t("shared.search")} showClear disabled={loading} />
              <ComboboxContent className="p-1 py-2">
                <ComboboxEmpty>{t("shared.no-items-found")}</ComboboxEmpty>
                <ComboboxList className="scrollbar p-0 px-1">
                  {(item) => (
                    <ComboboxItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )}
        </Field>
        <Field className="gap-2">
          <Label className="text-primary/80">{t("filters.chroma")}</Label>
          {isChromasLoading ? (
            <Skeleton className="h-9" />
          ) : (
            <Combobox
              items={orderBy(chromas, "name")}
              value={getValue("chromaId")}
              itemToStringLabel={(value: string) => chromas.find((c) => c.id.toString() === value)?.name ?? value}
              onValueChange={(value) => setValue("chromaId", value)}
              disabled={loading}
            >
              <ComboboxInput placeholder={t("shared.search")} showClear disabled={loading} />
              <ComboboxContent className="p-1 py-2">
                <ComboboxEmpty>{t("shared.no-items-found")}</ComboboxEmpty>
                <ComboboxList className="scrollbar p-0 px-1">
                  {(item) => (
                    <ComboboxItem key={item.id} value={item.id.toString()}>
                      <ChromaColor colors={item.colors} className="size-5 rounded-sm border-none" />
                      {item.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )}
        </Field>
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
