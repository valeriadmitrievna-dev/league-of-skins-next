"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useContext, FC, PropsWithChildren, useCallback } from "react";

import { TokenPayload } from "@/lib/auth";
import { fetchClient } from "@/lib/fetchClient";

interface AuthContext {
  userId: string | null;
  isAuth: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | null>(null);

interface AuthProviderProps extends PropsWithChildren {
  initialUserId?: string | null;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children, initialUserId = null }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
  } = useQuery<TokenPayload | null>({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return await fetchClient<TokenPayload>("/api/auth/me");
      } catch {
        // accessToken отсутствует или протух — пробуем refresh
        try {
          await fetchClient("/api/auth/refresh", { method: "POST" });
          return await fetchClient<TokenPayload>("/api/auth/me");
        } catch {
          return null;
        }
      }
    },
    initialData: initialUserId !== null ? ({ userId: initialUserId } as TokenPayload) : undefined,
    staleTime: 1000 * 60 * 5, // 5 минут — не долбим /me на каждый ремаунт
    retry: false,
  });

  const { mutateAsync: doRefresh } = useMutation({
    mutationFn: () => fetchClient("/api/auth/refresh", { method: "POST" }),
    onSuccess: async () => {
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: () => {
      queryClient.setQueryData(["me"], null);
    },
  });

  const refresh = useCallback(async () => {
    await doRefresh();
  }, [doRefresh]);

  const userId = data?.userId ?? null;

  return (
    <AuthContext.Provider value={{ isAuth: !!userId, userId, isLoading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
