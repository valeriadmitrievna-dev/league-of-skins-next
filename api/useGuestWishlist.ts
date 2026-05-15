import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";
import { DbWishlist, DbWishlistData } from '@/types/db';

const useGuestWishlist = (link: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["guestWishlist", link],
    queryFn: () => fetchClient<DbWishlist & DbWishlistData>("/api/wishlists/guest/" + link),
    enabled: enabled && !!link,
  });
};

export default useGuestWishlist;
