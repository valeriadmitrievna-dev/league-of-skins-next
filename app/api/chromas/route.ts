import { createChromaPredicate } from '@/shared/utils/createChromaPredicate';
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from '@/shared/utils/getLanguageCode';
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const lang = getLanguageCode(req.headers.get("Language") ?? "en");

    const { page, size, ...params } = Object.fromEntries(req.nextUrl.searchParams);

    const appData: any = await getLangAppData(lang);
    const predicate = await createChromaPredicate(params, null);
    const filteredChromas = appData.chromas.filter(predicate);

    return Response.json({
      count: filteredChromas.length,
      data: getPaginatedSlice(filteredChromas, page, size),
    });
  } catch {
    return Response.json({ code: "ERR_0000" }, { status: 500 });
  }
}
