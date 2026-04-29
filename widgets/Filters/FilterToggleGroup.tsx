import { Fragment, type FC } from "react";

import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/shared/cn";
import { OptionItem } from "@/shared/types";

interface FilterToggleGroupProps {
  value: string;
  onChange: (value?: string) => void;
  options: OptionItem[];
  className?: string;
  disabled?: boolean;
  label?: string;
}

const FilterToggleGroup: FC<FilterToggleGroupProps> = ({ value, onChange, options, className, disabled, label }) => {
  const WrapperComponent = label ? Field : Fragment;

  return (
    <WrapperComponent {...(label ? { className: "gap-y-2" } : {})}>
      {label && <Label className="text-primary/80">{label}</Label>}
      <ToggleGroup
        variant="outline"
        // spacing={2}
        type="single"
        value={value}
        onValueChange={onChange}
        className={cn("w-full", className)}
        disabled={disabled}
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            className={cn("grow text-[14px]! font-normal", option.className)}
            value={option.value}
          >
            {/* {option.label} */}
            {option.value}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </WrapperComponent>
  );
};

export default FilterToggleGroup;
