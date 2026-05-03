import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";
import { AppDataChroma } from '@/types/appdata';

const useChromasUnique = (langCode: string = "en_US") => {
  return useQuery({
    queryKey: ["chromas_unique", langCode],
    queryFn: () =>
      fetchClient<{ count: number; data: AppDataChroma[] }>("/api/chromas/unique", {
        headers: { Language: langCode },
      }).then((res) => res.data ?? []),
  });
};

export default useChromasUnique;
