"use client";
import { api } from "@/hooks/useApi";
import { useEffect, useState } from "react";

const useAuth = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    api<{ ok: boolean }>("/api/auth/me")
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));
  }, []);

  return { isAuth, loading: isAuth === null };
};

export default useAuth;
