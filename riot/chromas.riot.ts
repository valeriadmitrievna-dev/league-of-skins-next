import { isEqual, uniqWith } from "lodash";

import { getLangAppData } from "@/shared/utils/getLangAppData";
import { AppDataChroma, AppDataChromaItem } from "@/types/appdata";

export const getChromas = async (lang: string = "en_US") => {
  try {
    const data = await getLangAppData(lang);

    if (data) {
      const chromas: AppDataChroma[] = uniqWith(
        data.skins
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

      return uniqWith(chromas, (a, b) => a.name === b.name && isEqual(a.colors, b.colors));
    }
  } catch (error) {
    console.error("[ERROR][getChromas]", (error as Error).message);
  }
};

export const getAllChromas = async (lang: string = "en_US") => {
  try {
    const data = await getLangAppData(lang);

    if (data) {
      const chromas: AppDataChromaItem[] = data.skins
        .filter((skin) => skin.chromas.length)
        .map((skin) =>
          skin.chromas?.map((chroma) => {
            return {
              id: chroma.id.toString(),
              contentId: chroma.contentId,
              skinName: skin.name,
              skinContentId: skin.contentId,
              championId: skin.championId,
              name: chroma.name,
              colors: chroma.colors,
              fullName: chroma.fullName,
              pbe: chroma.pbe,
            };
          }),
        )
        .flat();

      return chromas;
    }
  } catch (error) {
    console.error("[ERROR][getChromas]", (error as Error).message);
  }
};
