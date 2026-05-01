"use client";
import { createContext, useContext, useEffect, useState, PropsWithChildren, FC } from "react";
import { api } from "@/hooks/useApi";

type DbUser = Record<string, unknown>;

interface UserContext {
  user: DbUser | null;
  isAuth: boolean;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const UserContext = createContext<UserContext | null>(null);

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<DbUser | null>(null);
  const [isLoading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await api<DbUser>("/api/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isAuth: !!user, isLoading, refetch: fetchUser }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
