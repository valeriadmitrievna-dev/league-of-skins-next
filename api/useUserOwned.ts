"use client";
import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/lib/fetchClient";

interface UserOwned {
  ownedSkinIds: string[];
  ownedChromaIds: string[];
}

const useUserOwned = () => {
  return useQuery({
    queryKey: ["userOwned"],
    queryFn: () => fetchClient<UserOwned>("/api/user/owned"),
  });
};

export default useUserOwned;