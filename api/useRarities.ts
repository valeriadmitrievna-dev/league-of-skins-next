import { fetchClient } from "@/lib/fetchClient";
import { useQuery } from "@tanstack/react-query";

const useRarities = () => {
  return useQuery({
    queryKey: ["rarities"],
    queryFn: () => fetchClient<string[]>("/api/rarities"),
  });
};

export default useRarities;
