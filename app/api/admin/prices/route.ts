import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { baseFolder } from "@/shared/constants/riot";
import { saveToJson } from "@/shared/utils/getFileData";
import { getPrices } from '@/shared/utils/getPrices';

export const GET = async (_: NextRequest) => {
  try {
    const prices = await getPrices();
    return Response.json(prices);
  } catch (error) {
    return errorHandler(error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    await saveToJson(`${baseFolder}/_prices.json`, data);
    return Response.json({ ok: true });
  } catch (error) {
    return errorHandler(error);
  }
};
