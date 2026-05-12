import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { baseFolder } from "@/shared/constants/riot";
import { readDirectory, saveToJson } from "@/shared/utils/getFileData";

// itemId: number
// startDate: Date
// endDate: Date
// price: number

export const GET = async (_: NextRequest) => {
  try {
    const dataRaw = await readDirectory(`${baseFolder}`);
    const sales = JSON.parse(dataRaw['_sales.json']);
    return Response.json(sales);
  } catch (error) {
    return errorHandler(error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    await saveToJson(`${baseFolder}/_sales.json`, data);
    return Response.json({ ok: true });
  } catch (error) {
    return errorHandler(error);
  }
};
