import { publicEndpoint } from "@/lib/endpoint";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";

export const GET = publicEndpoint(async ({ language, query }) => {
  const { page, size } = query();
  const appData = await getLangAppData(language);
  const skinlines = appData?.skinlines.filter((s) => s.name) ?? [];

  return {
    count: skinlines.length,
    data: getPaginatedSlice(skinlines, page, size),
  };
});
