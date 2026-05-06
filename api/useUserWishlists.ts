import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";
import { DbUser } from '@/types/db';

const useUserWishlists = () => {
  return useQuery({
    queryKey: ["userWishlists"],
    queryFn: () => fetchClient<DbUser>("/api/wishlists"),
  });
};

export default useUserWishlists;
