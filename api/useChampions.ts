import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";
import { AppDataChampion } from '@/types/appdata';

const useChampions = (langCode: string = "en_US") => {
  return useQuery({
    queryKey: ["champions", langCode],
    queryFn: () =>
      fetchClient<{ count: number; data: AppDataChampion[] }>("/api/champions", {
        headers: { Language: langCode },
      }).then((res) => res.data ?? []),
  });
};

export default useChampions;
