import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";
import { ODataResponse } from '@/shared/types';
import { AppDataChroma } from '@/types/appdata';

const useWishlistChromas = (id: string, lang: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["wishlistChromas", id, lang],
    queryFn: () => fetchClient<ODataResponse<AppDataChroma[]>>("/api/wishlists/chromas", { query: { wishlistId: id } }),
    enabled: enabled && !!id,
  });
};

export default useWishlistChromas;
