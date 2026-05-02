import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";
import { NextRequest } from "next/server";

export async function GET (req: NextRequest) {
  try {
    const lang = getLanguageCode(req.headers.get("Language") ?? "en");
    const { page, size } = Object.fromEntries(req.nextUrl.searchParams);

    const champions = (await getLangAppData(lang) as any)?.champions ?? [];

    return Response.json({
      count: champions.length,
      data: getPaginatedSlice(champions, page, size),
    });
  } catch {
    return Response.json({ code: "ERR_0000" }, { status: 500 });
  }
};
