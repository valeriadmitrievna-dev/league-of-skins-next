import { endpoint } from "@/lib/endpoint";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";
import { AppDataChroma } from '@/types/appdata';
import { isEqual, uniqWith } from "lodash";

export const GET = endpoint(async ({ language, query }) => {
  const { page, size } = query();
  const appData = await getLangAppData(language);
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

  return {
    count: chromas.length,
    data: getPaginatedSlice(chromas, page, size),
  };
});
