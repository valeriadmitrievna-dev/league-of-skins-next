"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/shared/providers/UserProvider";
import { clearPendingWishlist, getPendingWishlist, PendingWishlist } from '@/lib/pendindWishlist';

const usePendingWishlist = () => {
  const { isAuth } = useUser();
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