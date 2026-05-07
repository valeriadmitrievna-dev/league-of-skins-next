import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";
import { useAuth } from '@/shared/providers/AuthProvider';
import { DbUser } from '@/types/db';

const useUser = () => {
  const { isAuth } = useAuth();
  return useQuery({
    queryKey: ["user"],
    queryFn: () => fetchClient<DbUser>("/api/user"),
    enabled: isAuth,
  });
};

export default useUser;
