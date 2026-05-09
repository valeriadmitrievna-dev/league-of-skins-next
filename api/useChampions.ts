import { useQuery } from "@tanstack/react-query";
import { useT } from 'next-i18next/client';

import { fetchClient } from "@/lib/fetchClient";
import { getLanguageCode } from '@/shared/utils/getLanguageCode';
import { AppDataChampion } from "@/types/appdata";

const useChampions = (inventory?: boolean) => {
  const { i18n } = useT();
  
  return useQuery({
    queryKey: ["champions", getLanguageCode(i18n.language)],
    queryFn: () =>
      fetchClient<{ count: number; data: AppDataChampion[] }>("/api/champions", {
        query: inventory ? { inventory } : {},
      }).then((res) => res.data ?? []),
  });
};

export default useChampions;
