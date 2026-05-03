"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, FC, PropsWithChildren } from "react";
import { fetchClient } from "@/lib/fetchClient";

type DbUser = Record<string, unknown>;

interface UserContext {
  user: DbUser | null;
  isAuth: boolean;
  isLoading: boolean;
  refetch: () => void;
}

const UserContext = createContext<UserContext | null>(null);

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: user = null, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchClient<DbUser>("/api/auth/me").catch(() => null),
    staleTime: Infinity,
    retry: false,
  });

  const refetch = () => queryClient.invalidateQueries({ queryKey: ["user"] });

  return (
    <UserContext.Provider value={{ user, isAuth: !!user, isLoading, refetch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};