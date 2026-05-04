import { NextRequest } from "next/server";

import { getLangCookie } from '@/lib/cookies';
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from '@/shared/utils/getLanguageCode';
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const { page, size } = Object.fromEntries(searchParams.entries());
  const lang = await getLangCookie();
  const appData = await getLangAppData(getLanguageCode(lang));
  const champions = appData?.champions ?? [];

  return Response.json({
    count: champions.length,
    data: getPaginatedSlice(champions, page, size),
  });
};
