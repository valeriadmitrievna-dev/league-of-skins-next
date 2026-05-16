import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";
import { DbWishlist, DbWishlistPreview } from '@/types/db';

const useUserWishlist = (id: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["userWishlist", id],
    queryFn: () => fetchClient<DbWishlist & DbWishlistPreview>("/api/wishlists/" + id),
    enabled: enabled && !!id,
  });
};

export default useUserWishlist;
