import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";
import { DbWishlist } from '@/types/db';

const useUserWishlist = (id: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["userWishlist", id],
    queryFn: () => fetchClient<DbWishlist>("/api/wishlists/" + id),
    enabled: enabled && !!id,
  });
};

export default useUserWishlist;
