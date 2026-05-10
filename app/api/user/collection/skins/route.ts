import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { createClient } from "@/lib/supabase/server";
import { createSkinPredicate } from "@/shared/utils/createSkinPredicate";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";
import { getServerUser } from "@/shared/utils/getServerUser";

export const GET = async (req: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient();

    const searchParams = req.nextUrl.searchParams;
    const { page, size, ...params } = Object.fromEntries(searchParams.entries());
    const lng = cookieStore.get("i18next")?.value ?? "en";

    const user = await getServerUser();

    const { data: userSkinsRows, error } = await supabase
      .from("user_skins")
      .select("contentId, purchased_date")
      .eq("user_id", user.id)
      .order("purchased_date", { ascending: false });

    if (error) throw error;

    const rows = userSkinsRows ?? [];
    const ownedSkinIds = new Set(rows.map((r) => r.contentId));

    const appData = await getLangAppData(getLanguageCode(lng));
    const skins = appData?.skins ?? [];

    const predicate = await createSkinPredicate({ ...params, legacy: "all", owned: "all" }, ownedSkinIds, lng);

    const result = skins.filter((skin) => ownedSkinIds.has(skin.contentId)).filter(predicate);

    const indexMap = new Map(rows.map((r, i) => [r.contentId, i]));
    const sorted = result.sort((a, b) => (indexMap.get(a.contentId) ?? 0) - (indexMap.get(b.contentId) ?? 0));

    return Response.json({ count: result.length, data: getPaginatedSlice(sorted, page, size) });
  } catch (error) {
    return errorHandler(error);
  }
};
