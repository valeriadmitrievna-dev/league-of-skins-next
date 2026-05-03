"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { fetchClient } from "@/lib/fetchClient";

const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = async () => {
    await fetchClient("/api/auth/logout", { method: "POST" });
    queryClient.setQueryData(["user"], null);
    router.refresh();
  };

  return logout;
};

export default useLogout;