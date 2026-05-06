"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useContext, FC, PropsWithChildren, useEffect, useRef } from "react";

import { RequestError } from "@/errors";
import { fetchClient } from "@/lib/fetchClient";

interface AuthContext {
  userId: string | null;
  isAuth: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContext | null>(null);

interface AuthProviderProps extends PropsWithChildren {
  initialUserId?: string | null;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children, initialUserId = null }) => {
  const router = useRouter();
  const isRefreshing = useRef(false);

  const {
    data: { userId } = { userId: initialUserId },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["me"],
    queryFn: () => fetchClient<{ userId: string | null }>("/api/auth/me"),
    initialData: initialUserId !== null ? { userId: initialUserId } : undefined,
    staleTime: 0,
    refetchOnMount: true,
  });

  const { mutate: refresh } = useMutation({
    mutationFn: () => fetchClient("/api/auth/refresh", { method: "POST" }),
    onSuccess: async () => {
      router.refresh();
    },
  });

  useEffect(() => {
    if (error && (error as RequestError).status === 401) {
      if (isRefreshing.current) return;
      isRefreshing.current = true;
      refresh(undefined, {
        onSettled: () => {
          isRefreshing.current = false;
        },
      });
    }
  }, [error]);

  return <AuthContext.Provider value={{ isAuth: !!userId, userId: userId ?? null, isLoading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
