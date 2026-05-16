"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { fetchClient } from "@/lib/fetchClient";
import { DbWishlist, DbWishlistPreview } from "@/types/db";

type GuestWishlistResponse = (DbWishlist & DbWishlistPreview) | { __redirect: string };

const useGuestWishlist = (link: string, enabled?: boolean) => {
  const router = useRouter();

  const query = useQuery({
    queryKey: ["guestWishlist", link],
    queryFn: () => fetchClient<GuestWishlistResponse>("/api/wishlists/guest/" + link),
    enabled: enabled && !!link,
  });

  const redirectId = query.data && "__redirect" in query.data ? query.data.__redirect : null;

  useEffect(() => {
    if (redirectId) {
      router.replace("/wishlists/" + redirectId);
    }
  }, [redirectId, router]);

  const data = query.data && !("__redirect" in query.data) ? query.data : undefined;

  return { ...query, data };
};

export default useGuestWishlist;
