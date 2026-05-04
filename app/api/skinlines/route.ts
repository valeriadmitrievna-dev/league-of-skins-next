import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { getLangCookie } from "@/lib/cookies";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const { page, size } = Object.fromEntries(searchParams.entries());
    const lang = await getLangCookie();
    const appData = await getLangAppData(getLanguageCode(lang));
    const skinlines = appData?.skinlines.filter((s) => s.name) ?? [];

    return Response.json({
      count: skinlines.length,
      data: getPaginatedSlice(skinlines, page, size),
    });
  } catch (error) {
    return errorHandler(error);
  }
};
