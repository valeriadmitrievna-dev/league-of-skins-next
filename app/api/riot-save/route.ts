import { NextRequest } from "next/server";

import { errorHandler } from '@/errors';
import { baseFolder } from "@/shared/constants/riot";
import { saveToJson } from "@/shared/utils/getFileData";
import { clearAppDataCache } from "@/shared/utils/getLangAppData";

export const POST = async (req: NextRequest) => {
  try {
    const { lang, ...data } = await req.json();
    await saveToJson(`${baseFolder}/${lang}.json`, { lang, updated: new Date(), ...data });
    clearAppDataCache();
    return Response.json({ ok: true });
  } catch (error) {
    errorHandler(error)
  }
};
