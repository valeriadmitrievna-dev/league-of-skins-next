import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { createClient } from "@/lib/supabase/server";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import { getServerUser } from "@/shared/utils/getServerUser";
import { getServerUserOwned } from "@/shared/utils/getServerUserOwned";
import { StatsSocialResponse } from "@/types/dashboard";

interface SkinSocialStats {
  totalUsers: number;
  usersWithFewer: number;
  skinOwnerCounts: Record<string, number>;
}

export const GET = async (_req: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const lng = cookieStore.get("i18next")?.value ?? "en";

    const user = await getServerUser();
    const [appData, { ownedSkinIds, ownedSkinContentIds }, supabase] = await Promise.all([
      getLangAppData(getLanguageCode(lng)),
      getServerUserOwned(),
      createClient(),
    ]);

    const allSkins = (appData?.skins ?? []).filter((s) => !s.pbe);

    const { data: rpcData, error: rpcError } = await supabase.rpc("get_skin_social_stats", {
      p_user_id: user.id,
      p_owned_skin_ids: ownedSkinContentIds,
    });

    if (rpcError) throw rpcError;

    const stats = rpcData as unknown as SkinSocialStats;
    const { totalUsers, usersWithFewer, skinOwnerCounts } = stats;

    let rarestSkin: StatsSocialResponse["rarestSkin"] = null;

    if (totalUsers > 0 && skinOwnerCounts) {
      const rarestEntry = Object.entries(skinOwnerCounts)
        .filter(([contentId]) => ownedSkinIds.has(contentId))
        .sort(([, a], [, b]) => a - b)[0];

      if (rarestEntry) {
        const [rarestContentId, rarestCount] = rarestEntry;
        const skin = allSkins.find((s) => s.contentId === rarestContentId);

        if (skin) {
          rarestSkin = {
            data: skin,
            ownershipPercent: Math.round((rarestCount / totalUsers) * 10000) / 100,
          };
        }
      }
    }

    const percentile =
      totalUsers > 0 ? Math.round((usersWithFewer / totalUsers) * 100) : 0;

    const response: StatsSocialResponse = {
      rarestSkin,
      comparedToAverage: {
        percentile,
        totalPlayers: totalUsers,
      },
    };

    return Response.json(response);
  } catch (error) {
    return errorHandler(error);
  }
};