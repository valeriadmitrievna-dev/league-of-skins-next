import { fetchClient } from "@/lib/fetchClient";
import { useQuery } from "@tanstack/react-query";

const useChampions = (langCode: string = "en_US") => {
  return useQuery({
    queryKey: ["champions", langCode],
    queryFn: () =>
      fetchClient<{ count: number; data: any[] }>("/api/champions", {
        headers: { Language: langCode },
      }).then((res) => res.data ?? []),
  });
};

export default useChampions;
