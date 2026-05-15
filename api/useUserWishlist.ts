import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";
import { DbWishlist, DbWishlistData } from '@/types/db';

const useUserWishlist = (id: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["userWishlist", id],
    queryFn: () => fetchClient<DbWishlist & DbWishlistData>("/api/wishlists/" + id),
    enabled: enabled && !!id,
  });
};

export default useUserWishlist;
