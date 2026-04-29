import { getLangAppData } from "@/shared/utils/getLangAppData";
import { isEqual, uniqWith } from "lodash";

export const getChromas = async (lang: string = "en_US") => {
  try {
    const data = await getLangAppData(lang);

    if (data) {
      const chromas: any[] = uniqWith(
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

      return uniqWith(chromas, (a, b) => a.name === b.name && isEqual(a.colors, b.colors)) as any[];
    }
  } catch (error) {
    console.error("[ERROR][getChromas]", (error as any).message);
  }
};

export const getAllChromas = async (lang: string = "en_US") => {
  try {
    const data = await getLangAppData(lang);

    if (data) {
      const chromas: any[] = data.skins
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
    console.error("[ERROR][getChromas]", (error as any).message);
  }
};
