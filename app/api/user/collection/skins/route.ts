import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { createSkinPredicate } from "@/shared/utils/createSkinPredicate";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";
import { getServerUser } from '@/shared/utils/getServerUser';

export const GET = async (req: NextRequest) => {
  try {
    const cookieStore = await cookies();

    const searchParams = req.nextUrl.searchParams;
    const { page, size, ...params } = Object.fromEntries(searchParams.entries());
    const lng = cookieStore.get("i18next")?.value ?? "en";

    const user = await getServerUser();

    const appData = await getLangAppData(getLanguageCode(lng));
    const skins = appData?.skins ?? [];

    const predicate = await createSkinPredicate({ ...params, legacy: "all", owned: "all" }, user, lng);
    const result = skins.filter((skin) => user.owned_skins.includes(skin.contentId)).filter(predicate);

    const indexMap = new Map(user.owned_skins.map((id: string, i: number) => [id, i]));
    const sorted = result.sort((a, b) => (indexMap.get(a.contentId) ?? 0) - (indexMap.get(b.contentId) ?? 0));

    return Response.json({ count: result.length, data: getPaginatedSlice(sorted, page, size) });
  } catch (error) {
    return errorHandler(error);
  }
};
