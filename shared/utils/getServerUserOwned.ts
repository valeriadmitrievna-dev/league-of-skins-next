import { cookies } from 'next/headers';

import { RequestError } from '@/errors';
import { verifyAccessToken } from '@/lib/auth';
import { createClient } from "@/lib/supabase/server";

interface UserOwned {
  ownedSkinIds: Set<string>;
  ownedChromaIds: Set<string>;
  ownedSkinContentIds: string[];
}

export const getServerUserOwned = async (): Promise<UserOwned> => {
  const supabase = await createClient();
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) throw new RequestError({ code: "ERR_0001", status: 401 });

  const payload = verifyAccessToken(accessToken);
  if (!payload) throw new RequestError({ code: "ERR_0001", status: 401 });

  const [{ data: skinRows, error: skinError }, { data: chromaRows, error: chromaError }] = await Promise.all([
    supabase.from("user_skins").select("contentId").eq("userId", payload.userId),
    supabase.from("user_chromas").select("contentId").eq("userId", payload.userId),
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
