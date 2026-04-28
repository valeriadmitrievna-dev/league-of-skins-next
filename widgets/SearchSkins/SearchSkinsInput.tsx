"use client";

import Search from "@/components/Search";
import { useQueryParams } from "@/hooks/useQueryParams";

const SearchSkinsInput = () => {
  const { get, update } = useQueryParams(["search"]);

  return <Search value={get("search") ?? ""} onSearch={(value) => update("search", value)} />;
};

export default SearchSkinsInput;
