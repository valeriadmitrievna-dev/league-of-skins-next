"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useContext, FC, PropsWithChildren, useEffect } from "react";

import LoadingScreen from '@/components/LoadingScreen';
import { RequestError } from "@/errors";
import { fetchClient } from "@/lib/fetchClient";

interface AuthContext {
  userId: string | null;
  isAuth: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const {
    data: { userId } = { userId: null },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["me"],
    queryFn: () => fetchClient<{ userId: string | null }>("/api/auth/me"),
    staleTime: Infinity,
    refetchOnMount: true,
  });

  const { mutate: refresh, isPending: isRefreshLoading } = useMutation({
    mutationFn: () => fetchClient("/api/auth/refresh", { method: "POST" }),
    onSuccess: async () => {
      router.refresh();
    },
  });

  useEffect(() => {
    if (error && (error as RequestError).status === 401) {
      refresh();
    }
  }, [error]);

  return (
    <AuthContext.Provider value={{ isAuth: !!userId, userId, isLoading: isLoading || isRefreshLoading }}>
      {isLoading || isRefreshLoading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
