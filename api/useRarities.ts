import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";

const useRarities = (inventory?: boolean) => {
  return useQuery({
    queryKey: ["rarities"],
    queryFn: () => fetchClient<string[]>("/api/rarities", {
      query: inventory ? { inventory } : {},
    }),
  });
};

export default useRarities;
