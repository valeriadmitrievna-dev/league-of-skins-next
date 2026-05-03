"use client";
import { orderBy } from "lodash";
import { type FC } from "react";

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

import { useQueryParams } from "@/hooks/useQueryParams";
import FilterPanelTitle from "../Filters/FilterPanelTitle";
import FilterToggleGroup from "../Filters/FilterToggleGroup";
import { useUser } from "@/shared/providers/UserProvider";
import { useT } from "next-i18next/client";
import { useApp } from '@/shared/providers/AppProvider';

interface SearchFiltersProps {
  champions: any[];
  skins: any[];
  className?: string;
}

const SearchChromasFilters: FC<SearchFiltersProps> = ({ champions, skins, className }) => {
  const { t } = useT();
  const { isAuth } = useUser();
  const { chromasCount } = useApp();

  const { get, update, updateMany, reset, hasActive } = useQueryParams([
    "owned",
    "skin",
    "championId",
    "skinContentId",
    "server",
  ]);

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
    updateMany({ skinContentId: null, championId: value });
  };

  return (
    <div className={cn("h-fit sticky top-4", className)}>
      <FilterPanelTitle onReset={hasActive && reset} className="mb-4" />
      <div className="flex flex-col gap-5">
        {isAuth && (
          <div className="flex flex-col gap-2">
            <FilterToggleGroup
              value={get("owned") ?? "all"}
              onChange={(value) => update("owned", value)}
              options={ownedOptions}
              className="grid grid-cols-[20%_1fr_1fr]"
            />
            <FilterToggleGroup
              value={get("skin") ?? "all"}
              onChange={(value) => update("skin", value)}
              options={skinsOptions}
              className="grid grid-cols-[20%_1fr_1fr]"
            />
          </div>
        )}
        <FilterToggleGroup
          value={get("server") ?? "all"}
          onChange={(value) => update("server", value)}
          options={serverOptions}
          className="grid grid-cols-[20%_1fr_1fr]"
          label={t("filters.server-label")}
        />
        <Field className="gap-2">
          <Label className="text-primary/80">{t("filters.champion")}</Label>
          <Combobox
            items={orderBy(champions, "name")}
            value={get("championId")}
            itemToStringLabel={(value: string) => champions.find((c) => c.id === value)?.name ?? value}
            onValueChange={changeChampionIdHandler}
          >
            <ComboboxInput placeholder={t("shared.search")} showClear />
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
        </Field>
        {!!get("championId") && (
          <Field className="gap-2">
            <Label className="text-primary/80">{t("filters.skin")}</Label>
            <Combobox
              items={orderBy(skins, "name")}
              value={get("skinContentId")}
              itemToStringLabel={(value: string) => skins.find((c) => c.contentId === value)?.name ?? value}
              onValueChange={(value) => update("skinContentId", value)}
            >
              <ComboboxInput placeholder={t("shared.search")} showClear />
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
          </Field>
        )}
        <p className="block text-sm text-muted-foreground">
          {t("filters.found_count", { count: chromasCount })} <span className="font-medium">{chromasCount}</span>{" "}
          {t("shared.skin", { count: chromasCount })}
        </p>
      </div>
    </div>
  );
};

export default SearchChromasFilters;
