import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";
import { DbUser } from '@/types/db';

const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => fetchClient<DbUser>("/api/user"),
  });
};

export default useUser;
