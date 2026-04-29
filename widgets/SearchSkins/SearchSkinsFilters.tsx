"use client";
import { orderBy } from "lodash";
import { type FC } from "react";

import ChromaColor from "@/components/ChromaColor";
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
import { RARITIES } from "@/shared/constants/rarities";
import { cn } from "@/shared/cn";

import { useQueryParams } from "@/hooks/useQueryParams";
import Skeleton from "@/components/Skeleton";
import FilterPanelTitle from "../Filters/FilterPanelTitle";
import FilterToggleGroup from "../Filters/FilterToggleGroup";

interface SearchFiltersProps {
  champions: any[];
  skinlines: any[];
  rarities: string[];
  chromas: any[];
  className?: string;
}

const SearchSkinsFilters: FC<SearchFiltersProps> = ({ champions, skinlines, rarities, chromas, className }) => {
  const t = (key: string) => key;
  const isAuth = false;

  const { get, update, reset, hasActive } = useQueryParams([
    "owned",
    "legacy",
    "championId",
    "rarity",
    "skinlineId",
    "chromaId",
    "server",
  ]);

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
      <FilterPanelTitle onReset={hasActive && reset} className="mb-4" />
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          {isAuth && (
            <FilterToggleGroup
              value={get("owned") ?? "all"}
              onChange={(value) => update("owned", value)}
              options={ownedOptions}
              className="grid grid-cols-[20%_1fr_1fr]"
            />
          )}
          <FilterToggleGroup
            value={get("legacy") ?? "all"}
            onChange={(value) => update("legacy", value)}
            options={legacyOptions}
            className="grid grid-cols-[20%_1fr_1fr]"
          />
        </div>
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
            onValueChange={(value) => update("championId", value)}
          >
            <ComboboxInput placeholder={t("shared.search")} showClear />
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
        </Field>
        <Field className="gap-2">
          <Label className="text-primary/80">{t("filters.rarity")}</Label>
          <Combobox
            items={rarities}
            value={get("rarity")}
            itemToStringLabel={(value: string) => t(`rarity.${rarities.find((c) => c === value)}`)}
            onValueChange={(value) => update("rarity", value)}
          >
            <ComboboxInput placeholder={t("shared.search")} showClear />
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
        </Field>
        <Field className="gap-2">
          <Label className="text-primary/80">{t("filters.skinline")}</Label>
          <Combobox
            items={orderBy(skinlines, "name")}
            value={get("skinlineId")}
            itemToStringLabel={(value: string) => skinlines.find((c) => c.id.toString() === value)?.name ?? value}
            onValueChange={(value) => update("skinlineId", value)}
          >
            <ComboboxInput placeholder={t("shared.search")} showClear />
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
        </Field>
        <Field className="gap-2">
          <Label className="text-primary/80">{t("filters.chroma")}</Label>
          <Combobox
            items={orderBy(chromas, "name")}
            value={get("chromaId")}
            itemToStringLabel={(value: string) => chromas.find((c) => c.id.toString() === value)?.name ?? value}
            onValueChange={(value) => update("chromaId", value)}
          >
            <ComboboxInput placeholder={t("shared.search")} showClear />
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
        </Field>
        {/* <p className="block text-sm text-muted-foreground">
          {t("filters.found_count", { count: skinsFound })} <span className="font-medium">{skinsFound}</span>{" "}
          {t("shared.skin", { count: skinsFound })}
        </p> */}
      </div>
    </div>
  );
};

export default SearchSkinsFilters;
