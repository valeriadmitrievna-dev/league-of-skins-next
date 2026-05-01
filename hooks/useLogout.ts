"use client";
import { api } from "@/hooks/useApi";
import { useUser } from "@/shared/providers/UserProvider";
import { useRouter } from "next/navigation";

const useLogout = () => {
  const router = useRouter();
  const { refetch: refetchUser } = useUser();

  const logout = async () => {
    await api("/api/auth/logout", { method: "POST" });
    await refetchUser();
    router.push("/auth/signin");
    router.refresh();
  };

  return logout;
};

export default useLogout;
