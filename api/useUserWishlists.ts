import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";
import { DbWishlist, DbWishlistPreview } from "@/types/db";

const useUserWishlists = (enabled?: boolean) => {
  return useQuery({
    queryKey: ["userWishlists"],
    queryFn: () => fetchClient<(DbWishlist & DbWishlistPreview)[]>("/api/wishlists"),
    enabled,
  });
};

export default useUserWishlists;
