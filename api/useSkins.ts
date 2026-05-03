import { fetchClient } from "@/lib/fetchClient";
import { AppDataSkin } from '@/types/appdata';
import { useQuery } from "@tanstack/react-query";

const useSkins = (championId: string | null, langCode: string = "en_US") => {
  return useQuery({
    queryKey: ["skins", langCode],
    queryFn: () =>
      fetchClient<{ count: number; data: AppDataSkin[] }>("/api/skins", {
        headers: { Language: langCode },
        query: { ...(championId ? { championId } : {}), hasChroma: true },
      }).then((res) => res.data ?? []),
    enabled: !!championId,
  });
};

export default useSkins;
