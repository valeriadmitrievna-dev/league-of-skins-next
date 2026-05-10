import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { getLangCookie } from "@/lib/cookies";
import { createChromaPredicate } from "@/shared/utils/createChromaPredicate";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const { page, size, ...params } = Object.fromEntries(searchParams.entries());
    const lang = await getLangCookie();

    const appData = await getLangAppData(getLanguageCode(lang));
    const predicate = createChromaPredicate({ ...params, skin: "all", owned: "all" }, null, null);
    const filteredChromas = appData.chromas.filter(predicate);

    return Response.json({
      count: filteredChromas.length,
      data: getPaginatedSlice(filteredChromas, page, size),
    });
  } catch (error) {
    return errorHandler(error);
  }
};
