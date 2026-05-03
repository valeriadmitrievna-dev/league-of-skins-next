import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";

const useRarities = () => {
  return useQuery({
    queryKey: ["rarities"],
    queryFn: () => fetchClient<string[]>("/api/rarities"),
  });
};

export default useRarities;
