"use client";
import { useEffect, useState } from "react";

import { clearPendingWishlist, getPendingWishlist, PendingWishlist } from "@/lib/pendingWishlist";
import { useAuth } from "@/shared/providers/AuthProvider";

const usePendingWishlist = () => {
  const { isAuth } = useAuth();
  const [pending, setPending] = useState<PendingWishlist | null>(null);

  useEffect(() => {
    if (!isAuth) return;

    const data = getPendingWishlist();
    if (data) {
      setPending(data);
      clearPendingWishlist();
    }
  }, [isAuth]);

  return pending;
};

export default usePendingWishlist;
