"use client";
import { SearchIcon, XIcon } from "lucide-react";
import { useT } from "next-i18next/client";
import { useState, type ChangeEvent, type ComponentProps, type FC } from "react";
import { useDebounce } from "react-use";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/shared/cn";

type SearchSize = "default" | "sm" | "lg";

interface SearchProps extends Omit<ComponentProps<"input">, "size"> {
  size?: SearchSize;
  onSearch?: (value: string) => void;
  onClear?: () => void;
}

const Search: FC<SearchProps> = ({ size, onSearch, onClear, className, value, ...inputProps }) => {
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
    if (size === "sm") return "h-8";
    else return "h-10";
  };

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const clearHandler = () => {
    setSearchInput("");
    onClear?.();
  };

  return (
    <InputGroup className={cn(getGroupClassName(size), "group border-foreground/15", className)}>
      <InputGroupInput
        placeholder={t("shared.search")}
        className="focus:placeholder:text-primary/50!"
        {...inputProps}
        value={searchInput}
        onChange={changeHandler}
      />
      <InputGroupAddon>
        <SearchIcon className="group-focus-within:text-primary transition-colors" />
      </InputGroupAddon>
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" onClick={clearHandler}>
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};

export default Search;
