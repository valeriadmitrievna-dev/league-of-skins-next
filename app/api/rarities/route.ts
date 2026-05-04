import { errorHandler } from "@/errors";
import { getLangAppData } from "@/shared/utils/getLangAppData";

export const GET = async () => {
  try {
    const appData = await getLangAppData();
    const rarities = new Set([...(appData?.skins ?? []).map((s) => s.rarity)]);

    return Response.json([...rarities]);
  } catch (error) {
    return errorHandler(error);
  }
};
