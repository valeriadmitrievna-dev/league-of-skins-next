"use client";
import { SearchIcon, XIcon } from "lucide-react";
import { useT } from "next-i18next/client";
import { ReactNode, useEffect, useState, type ChangeEvent, type ComponentProps, type FC } from "react";
import { useDebounce } from "react-use";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/shared/cn";

type SearchSize = "default" | "sm" | "lg";

interface SearchProps extends Omit<ComponentProps<"input">, "size" | 'suffix' | 'prefix'> {
  size?: SearchSize;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

const Search: FC<SearchProps> = ({ size, onSearch, onClear, className, value, prefix, suffix, ...inputProps }) => {
  const { t } = useT();

  const [searchInput, setSearchInput] = useState(String(value ?? ""));

  useDebounce(
    () => {
      if (searchInput !== (value ?? "")) {
        onSearch?.(searchInput);
      }
    },
    300,
    [searchInput, value],
  );

  const getGroupClassName = (size?: SearchSize) => {
    if (size === "lg") return "h-12 px-1";
    if (size === "sm") return "h-9";
    else return "h-11 px-1 gap-x-1";
  };

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const clearHandler = () => {
    setSearchInput("");
    onClear?.();
  };

  useEffect(() => {
    setSearchInput(String(value ?? ""));
  }, [value]);

  return (
    <InputGroup className={cn(getGroupClassName(size), "group border-0", className)}>
      <InputGroupInput placeholder={t("shared.search")} {...inputProps} value={searchInput} onChange={changeHandler} />
      <InputGroupAddon className={cn({ 'pl-1.5': !!prefix })}>
        {prefix ?? <SearchIcon />}
      </InputGroupAddon>
      {searchInput && !suffix && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" onClick={clearHandler}>
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      )}
      {!!suffix && (
        <InputGroupAddon align="inline-end" className='pr-1.5'>
          {suffix}
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};

export default Search;
