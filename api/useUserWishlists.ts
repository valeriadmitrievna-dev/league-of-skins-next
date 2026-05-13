import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";
import { DbWishlist } from '@/types/db';

const useUserWishlists = (enabled?: boolean) => {
  return useQuery({
    queryKey: ["userWishlists"],
    queryFn: () => fetchClient<DbWishlist[]>("/api/wishlists"),
    enabled,
  });
};

export default useUserWishlists;
