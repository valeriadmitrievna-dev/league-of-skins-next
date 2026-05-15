import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";
import { ODataResponse } from '@/shared/types';
import { AppDataSkin } from '@/types/appdata';

const useWishlistSkins = (id: string, lang: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["wishlistSkins", id, lang],
    queryFn: () => fetchClient<ODataResponse<AppDataSkin[]>>("/api/wishlists/skins", { query: { wishlistId: id } }),
    enabled: enabled && !!id,
  });
};

export default useWishlistSkins;
