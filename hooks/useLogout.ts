"use client";
import { api } from "@/hooks/useApi";
import { useRouter } from "next/navigation";

const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    await api("/api/auth/logout", { method: "POST" });
    router.push("/auth/signin");
    router.refresh();
  };

  return logout;
};

export default useLogout;
