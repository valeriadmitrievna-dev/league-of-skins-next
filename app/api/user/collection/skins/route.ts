import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { errorHandler, RequestError } from "@/errors";
import { verifyAccessToken } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createSkinPredicate } from '@/shared/utils/createSkinPredicate';
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getPaginatedSlice } from "@/shared/utils/getPaginatedSlice";

export const GET = async (req: NextRequest) => {
  try {
    const supabase = await createClient();
    const cookieStore = await cookies();

    const searchParams = req.nextUrl.searchParams;
    const { page, size, ...params } = Object.fromEntries(searchParams.entries());
    const lng = cookieStore.get("i18next")?.value ?? "en";

    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) throw new RequestError({ code: "ERR_0001", status: 401 });

    const payload = verifyAccessToken(accessToken);
    if (!payload) throw new RequestError({ code: "ERR_0001", status: 401 });

    const { data: user, error } = await supabase.from("users").select("*").eq("id", payload.userId).single();
    if (!user || error) throw new RequestError({ code: "ERR_0001", status: 401, message: error.message ?? "No user" });

    const appData = await getLangAppData(lng);
    const skins = appData?.skins ?? [];

    const result = user.owned_skins.map((u) => skins.find((s) => s.contentId === u)).filter((s) => !!s);

    const predicate = await createSkinPredicate(params, user, lng);
    const filteredSkins = appData.skins.filter(predicate);

    return Response.json({ count: result.length, data: getPaginatedSlice(filteredSkins, page, size) });
  } catch (error) {
    return errorHandler(error);
  }
};
