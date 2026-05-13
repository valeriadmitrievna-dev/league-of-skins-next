import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";
import { DbWishlist } from '@/types/db';

const useGuestWishlist = (link: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["guestWishlist", link],
    queryFn: () => fetchClient<DbWishlist>("/api/wishlists/guest/" + link),
    enabled: enabled && !!link,
  });
};

export default useGuestWishlist;
