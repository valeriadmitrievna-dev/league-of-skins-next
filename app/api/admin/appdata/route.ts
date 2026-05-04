import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { baseFolder } from "@/shared/constants/riot";
import { LangProgress } from "@/shared/riot/types";
import { readDirectory } from "@/shared/utils/getFileData";

export const GET = async (_: NextRequest) => {
  try {
    const languagesDataRaw = await readDirectory(baseFolder);
    const languagesData = Object.values(languagesDataRaw).map((raw) => JSON.parse(raw));

    const result: Record<string, LangProgress> = Object.fromEntries(
      languagesData.map((data) => {
        return [
          data.lang,
          {
            status: "done",
            lastUpdate: data.updated,
            categories: { versions: "done" },
            counts: {
              skinlines: data.skinlines.length,
              champions: data.champions.length,
              skins: data.skins.length,
              chromas: data.chromas.length,
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
