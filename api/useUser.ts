"use client";
import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";
import { DbUser } from "@/types/db";

const useUser = (enabled?: boolean) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => fetchClient<DbUser>("/api/user"),
    enabled,
  });
};

export default useUser;
