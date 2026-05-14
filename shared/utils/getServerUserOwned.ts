import { cookies } from "next/headers";

import { RequestError } from "@/errors";
import { verifyAccessToken } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

interface UserOwned {
  ownedSkinIds: Set<string>;
  ownedChromaIds: Set<string>;
  ownedSkinContentIds: string[];
}

export const getServerUserOwned = async (anotherUserId?: string): Promise<UserOwned> => {
  const supabase = await createClient();
  let userId = anotherUserId;

  if (!anotherUserId) {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) throw new RequestError({ code: "ERR_0001", status: 401 });

    const payload = verifyAccessToken(accessToken);
    if (!payload) throw new RequestError({ code: "ERR_0001", status: 401 });

    userId = payload.userId;
  }

  const [{ data: skinRows, error: skinError }, { data: chromaRows, error: chromaError }] = await Promise.all([
    supabase.from("user_skins").select("contentId").eq("user_id", userId!),
    supabase.from("user_chromas").select("contentId").eq("user_id", userId!),
  ]);

  if (skinError) throw skinError;
  if (chromaError) throw chromaError;

  const ownedSkinContentIds = (skinRows ?? []).map((r) => r.contentId);

  return {
    ownedSkinIds: new Set(ownedSkinContentIds),
    ownedChromaIds: new Set((chromaRows ?? []).map((r) => r.contentId)),
    ownedSkinContentIds,
  };
};
