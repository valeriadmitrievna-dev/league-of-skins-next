import { useT } from "next-i18next/client";
import { FC } from "react";

import Skeleton from "@/components/Skeleton";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { cn } from "@/shared/cn";
import { OptionItem } from "@/shared/types";

interface FilterListProps {
  options: OptionItem[];
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
}

const FilterList: FC<FilterListProps> = ({ options, value, onChange, disabled, loading, label, placeholder, className }) => {
  const { t } = useT();

  return (
    <Field className={cn("gap-2", className)}>
      {label && <Label className="text-primary/80">{label}</Label>}
      {loading ? (
        <Skeleton className="h-9" />
      ) : (
        <Combobox
          items={options}
          value={value}
          itemToStringLabel={(value: string) => options.find((c) => c.value === value)?.label ?? value}
          onValueChange={onChange}
          disabled={disabled}
        >
          <ComboboxInput placeholder={placeholder ?? t("shared.search")} showClear disabled={disabled} />
          <ComboboxContent className="p-1 py-2">
            <ComboboxEmpty>{t("shared.no-items-found")}</ComboboxEmpty>
            <ComboboxList className="scrollbar p-0 px-1">
              {(item: OptionItem) => (
                <ComboboxItem key={item.value} value={item.value}>
                  {item.prefix}
                  {item.label}
                  {item.suffix}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      )}
    </Field>
  );
};

export default FilterList;
