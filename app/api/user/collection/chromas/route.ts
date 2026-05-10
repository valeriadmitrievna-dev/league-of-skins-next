import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { createClient } from "@/lib/supabase/server";
import { createChromaPredicate } from "@/shared/utils/createChromaPredicate";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";
import { getServerUser } from "@/shared/utils/getServerUser";

export const GET = async (req: NextRequest) => {
  try {
    const supabase = await createClient();
    const cookieStore = await cookies();

    const searchParams = req.nextUrl.searchParams;
    const { page, size, ...params } = Object.fromEntries(searchParams.entries());
    const lng = cookieStore.get("i18next")?.value ?? "en";

    const user = await getServerUser();

    const [{ data: userChromasRows, error: chromasError }, { data: userSkinsRows, error: skinsError }] = await Promise.all([
      supabase.from("user_chromas").select("contentId, purchased_date").eq("userId", user.id).order("purchased_date", { ascending: false }),
      supabase.from("user_skins").select("contentId").eq("userId", user.id),
    ]);

    if (chromasError) throw chromasError;
    if (skinsError) throw skinsError;

    const chromaRows = userChromasRows ?? [];
    const ownedChromaIds = new Set(chromaRows.map((r) => r.contentId));
    const ownedSkinIds = new Set((userSkinsRows ?? []).map((r) => r.contentId));

    const appData = await getLangAppData(getLanguageCode(lng));
    const chromas = appData?.chromas ?? [];

    const predicate = createChromaPredicate({ ...params, skin: "all", owned: "all" }, ownedChromaIds, ownedSkinIds);

    const result = chromas.filter((chroma) => ownedChromaIds.has(chroma.contentId)).filter(predicate);

    const indexMap = new Map(chromaRows.map((r, i) => [r.contentId, i]));
    const sorted = result.sort((a, b) => (indexMap.get(a.contentId) ?? 0) - (indexMap.get(b.contentId) ?? 0));

    return Response.json({ count: result.length, data: getPaginatedSlice(sorted, page, size) });
  } catch (error) {
    return errorHandler(error);
  }
};
