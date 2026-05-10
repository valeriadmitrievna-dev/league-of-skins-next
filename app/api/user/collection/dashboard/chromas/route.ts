import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import { getServerUserOwned } from "@/shared/utils/getServerUserOwned";
import { StatsChromasResponse } from "@/types/dashboard";

export const GET = async (_req: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const lng = cookieStore.get("i18next")?.value ?? "en";

    const [appData, { ownedChromaIds }] = await Promise.all([
      getLangAppData(getLanguageCode(lng)),
      getServerUserOwned(),
    ]);

    const allChromas = (appData?.chromas ?? []).filter((c) => !c.pbe);

    const colorCountMap = new Map<string, number>();

    for (const chroma of allChromas) {
      if (!ownedChromaIds.has(chroma.contentId)) continue;
      for (const color of chroma.colors) {
        const normalized = color.toLowerCase().trim();
        colorCountMap.set(normalized, (colorCountMap.get(normalized) ?? 0) + 1);
      }
    }

    const mostFrequentColors = [...colorCountMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([color, count]) => ({ color, count }));

    const response: StatsChromasResponse = { mostFrequentColors };

    return Response.json(response);
  } catch (error) {
    return errorHandler(error);
  }
};