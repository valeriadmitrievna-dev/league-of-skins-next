import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { baseFolder } from "@/shared/constants/riot";
import { LangProgress } from "@/shared/riot/types";
import { readDirectory } from "@/shared/utils/getFileData";
import { AppDataLang } from '@/types/appdata';

export const GET = async (_: NextRequest) => {
  try {
    const languagesDataRaw = await readDirectory(baseFolder);
    const languagesData: AppDataLang[] = Object.values(languagesDataRaw).map((raw) => JSON.parse(raw));

    const result: Record<string, LangProgress> = Object.fromEntries(
      languagesData.map((data) => {
        return [
          data.lang,
          {
            status: "done",
            lastUpdate: String(data.updated),
            categories: { versions: "done" },
            counts: {
              skinlines: data.skinlines.length,
              champions: data.champions.length,
              skins: data.skins.length,
              skins_pbe: data.skins.filter(s => s.pbe).length,
              chromas: data.chromas.length,
              chromas_pbe: data.chromas.filter(c => c.pbe).length,
            },
          },
        ];
      }),
    );

    return Response.json(result);
  } catch (error) {
    return errorHandler(error);
  }
};
