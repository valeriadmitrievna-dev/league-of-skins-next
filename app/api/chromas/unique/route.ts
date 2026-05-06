import { isEqual, uniqWith } from "lodash";
import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { getLangCookie } from "@/lib/cookies";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";
import { AppDataChroma } from "@/types/appdata";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const { page, size } = Object.fromEntries(searchParams.entries());
    const lang = await getLangCookie();

    const appData = await getLangAppData(getLanguageCode(lang));

    const chromas: AppDataChroma[] = uniqWith(
      (appData?.skins ?? [])
        .filter((skin) => skin.chromas.length)
        .map((skin) =>
          skin.chromas?.map((chroma) => {
            return {
              id: chroma.id.toString(),
              contentId: chroma.contentId,
              name: chroma.name,
              skinName: skin.name,
              skinContentId: skin.contentId,
              championId: skin.championId,
              colors: chroma.colors,
              path: chroma.path,
              fullName: chroma.fullName,
              pbe: chroma.pbe,
            };
          }),
        )
        .flat(),
      (a, b) => a.name === b.name && isEqual(a.colors, b.colors),
    );

    return Response.json({
      count: chromas.length,
      data: getPaginatedSlice(chromas, page, size),
    });
  } catch (error) {
    return errorHandler(error);
  }
};
