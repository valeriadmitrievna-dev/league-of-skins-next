"use client";
import { orderBy } from "lodash";
import { useT } from "next-i18next/client";
import { type FC } from "react";

import useChampions from "@/api/useChampions";
import useSkins from "@/api/useSkins";
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
import { useUser } from "@/shared/providers/UserProvider";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";

import FilterPanelTitle from "./Filters/FilterPanelTitle";
import FilterToggleGroup from "./Filters/FilterToggleGroup";

type SearchChromasParam = "owned" | "skin" | "championId" | "skinContentId" | "server";

interface SearchFiltersProps {
  getValue: (key: SearchChromasParam) => string | null;
  setValue: (key: SearchChromasParam, value?: string | null) => void;
  setValueMany: (updates: Partial<Record<SearchChromasParam, string | null | undefined>>) => void;
  count?: number;
  loading?: boolean;
  reset?: () => void;
  className?: string;
}

const SearchChromasFilters: FC<SearchFiltersProps> = ({
  getValue,
  setValue,
  setValueMany,
  loading,
  reset,
  className,
  count,
}) => {
  const { t, i18n } = useT();
  const { isAuth } = useUser();

  const langCode = getLanguageCode(i18n.language);

  const { data: champions = [], isLoading: isChampionsLoading } = useChampions(langCode);
  const { data: skins = [], isLoading: isSkinsLoading } = useSkins(getValue("championId"), i18n.language);

  const ownedOptions = [
    { value: "all", label: t("filters.all") },
    { value: "on", label: t("filters.owned-on") },
    { value: "off", label: t("filters.owned-off") },
  ];

  const skinsOptions = [
    { value: "all", label: t("filters.all") },
    { value: "on", label: t("filters.skin-on") },
    { value: "off", label: t("filters.skin-off") },
  ];

  const serverOptions = [
    { value: "all", label: t("filters.all") },
    { value: "latest", label: t("filters.server-latest") },
    { value: "pbe", label: t("filters.server-pbe") },
  ];

  const changeChampionIdHandler = (value: string | null) => {
    setValueMany({ skinContentId: null, championId: value });
  };

  return (
    <div className={cn("h-fit sticky top-4", className)}>
      <FilterPanelTitle onReset={reset} className="mb-4" />
      <div className="flex flex-col gap-5">
        {isAuth && (
          <div className="flex flex-col gap-2">
            <FilterToggleGroup
              value={getValue("owned") ?? "all"}
              onChange={(value) => setValue("owned", value)}
              options={ownedOptions}
              className="grid grid-cols-[20%_1fr_1fr]"
              disabled={loading}
            />
            <FilterToggleGroup
              value={getValue("skin") ?? "all"}
              onChange={(value) => setValue("skin", value)}
              options={skinsOptions}
              className="grid grid-cols-[20%_1fr_1fr]"
              disabled={loading}
            />
          </div>
        )}
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
              onValueChange={changeChampionIdHandler}
              disabled={loading}
            >
              <ComboboxInput placeholder={t("shared.search")} showClear disabled={loading} />
              <ComboboxContent className="p-1 py-2">
                <ComboboxEmpty>{t("shared.no-items-found")}</ComboboxEmpty>
                <ComboboxList className="scrollbar p-0 px-1">
                  {(item) => (
                    <ComboboxItem key={item.id} value={item.id}>
                      {item.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )}
        </Field>
        {!!getValue("championId") && (
          <Field className="gap-2">
            <Label className="text-primary/80">{t("filters.skin")}</Label>
            {isSkinsLoading ? (
              <Skeleton className="h-9" />
            ) : (
              <Combobox
                items={orderBy(skins, "name")}
                value={getValue("skinContentId")}
                itemToStringLabel={(value: string) => skins.find((c) => c.contentId === value)?.name ?? value}
                onValueChange={(value) => setValue("skinContentId", value)}
                disabled={loading}
              >
                <ComboboxInput placeholder={t("shared.search")} showClear disabled={loading} />
                <ComboboxContent className="p-1 py-2">
                  <ComboboxEmpty>{t("shared.no-items-found")}</ComboboxEmpty>
                  <ComboboxList className="scrollbar p-0 px-1">
                    {(item) => (
                      <ComboboxItem key={item.contentId} value={item.contentId}>
                        {item.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )}
          </Field>
        )}
        {!!count && (
          <p className="block text-sm text-muted-foreground">
            {t("filters.found_count", { count })} <span className="font-medium">{count}</span> {t("shared.skin", { count })}
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchChromasFilters;
