import { useQuery } from "@tanstack/react-query";
import { useT } from 'next-i18next/client';

import { fetchClient } from "@/lib/fetchClient";
import { getLanguageCode } from '@/shared/utils/getLanguageCode';
import { AppDataSkinline } from "@/types/appdata";

const useSkinlines = (inventory?: boolean) => {
  const { i18n } = useT();

  return useQuery({
    queryKey: ["skinlines", getLanguageCode(i18n.language)],
    queryFn: () =>
      fetchClient<{ count: number; data: AppDataSkinline[] }>("/api/skinlines", {
        query: inventory ? { inventory } : {},
      }).then((res) => res.data ?? []),
  });
};

export default useSkinlines;
