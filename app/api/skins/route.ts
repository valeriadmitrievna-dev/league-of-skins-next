import { getLangAppData } from "@/shared/api/utils/getLangAppData";
import { getPaginatedSlice } from "@/shared/api/utils/getPaginatedSlice";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const lang = req.headers.get("Language") ?? "en";

    const { page, size, ...params } = Object.fromEntries(req.nextUrl.searchParams);

    const skins = (await getLangAppData(lang))?.skins ?? [];

    return Response.json({
      count: skins.length,
      data: getPaginatedSlice(skins, page, size),
    });
  } catch {
    return Response.json({ code: "ERR_0000" }, { status: 500 });
  }
}
