import { fetchClient } from "@/lib/fetchClient";
import { useQuery } from "@tanstack/react-query";

const useChromasUnique = (langCode: string = "en_US") => {
  return useQuery({
    queryKey: ["chromas_unique", langCode],
    queryFn: () =>
      fetchClient<{ count: number; data: any[] }>("/api/chromas/unique", {
        headers: { Language: langCode },
      }).then((res) => res.data ?? []),
  });
};

export default useChromasUnique;
