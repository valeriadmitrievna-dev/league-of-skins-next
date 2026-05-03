import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";
import { AppDataSkinline } from "@/types/appdata";

const useSkinlines = (langCode: string = "en_US") => {
  return useQuery({
    queryKey: ["skinlines", langCode],
    queryFn: () =>
      fetchClient<{ count: number; data: AppDataSkinline[] }>("/api/skinlines", {
        headers: { Language: langCode },
      }).then((res) => res.data ?? []),
  });
};

export default useSkinlines;
