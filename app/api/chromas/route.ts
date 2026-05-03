import { endpoint } from "@/lib/endpoint";
import { createChromaPredicate } from "@/shared/utils/createChromaPredicate";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";

export const GET = endpoint(async ({ language, query, user }) => {
  const { page, size, ...params } = query();

  const appData = await getLangAppData(language);
  const predicate = createChromaPredicate(params, user);
  const filteredChromas = appData.chromas.filter(predicate);

  return {
    count: filteredChromas.length,
    data: getPaginatedSlice(filteredChromas, page, size),
  };
});
