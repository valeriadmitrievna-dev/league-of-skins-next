"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, FC, PropsWithChildren, useState } from "react";

import { fetchClient } from "@/lib/fetchClient";
import { DbUser } from "@/types/db";

interface UserContext {
  user: DbUser | null;
  isAuth: boolean;
  isLoading: boolean;
  refetch: () => void;
}

const UserContext = createContext<UserContext | null>(null);

const getInitialAuth = () => {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("isAuth=1");
};

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = useQueryClient();
  const [isAuthFast] = useState(getInitialAuth);

  const { data: user = null, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchClient<DbUser>("/api/auth/me").catch(() => null),
    staleTime: Infinity,
    retry: false,
  });

  const refetch = () => queryClient.invalidateQueries({ queryKey: ["user"] });

  const isAuth = user ? true : isAuthFast;

  return <UserContext.Provider value={{ user, isAuth, isLoading, refetch }}>{children}</UserContext.Provider>;
};
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
