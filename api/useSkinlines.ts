import { fetchClient } from "@/lib/fetchClient";
import { useQuery } from "@tanstack/react-query";

const useSkinlines = (langCode: string = "en_US") => {
  return useQuery({
    queryKey: ["skinlines", langCode],
    queryFn: () =>
      fetchClient<{ count: number; data: any[] }>("/api/skinlines", {
        headers: { Language: langCode },
      }).then((res) => res.data ?? []),
  });
};

export default useSkinlines;
