import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { createClient } from "@/lib/supabase/server";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import { getServerUser } from "@/shared/utils/getServerUser";
import { getServerUserOwned } from "@/shared/utils/getServerUserOwned";
import { CollectionRank, CollectionRankData, StatsSocialResponse } from "@/types/dashboard";

// Веса редкостей для rarity score
const RARITY_WEIGHTS: Record<string, number> = {
  kUltimate: 10,
  kMythic: 7,
  kLegendary: 5,
  kEpic: 3,
  kRare: 2,
  kUncommon: 1,
  kNoRarity: 0,
};

const MIN_SKINLINE_SIZE = 2;

const getRank = (score: number): CollectionRank => {
  if (score >= 95) return "Master";
  if (score >= 80) return "Diamond";
  if (score >= 65) return "Platinum";
  if (score >= 50) return "Gold";
  if (score >= 35) return "Silver";
  if (score >= 20) return "Bronze";
  return "Iron";
};

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

    // ── RPC ─────────────────────────────────────────────────────────────────
    const { data: rpcData, error: rpcError } = await supabase.rpc("get_skin_social_stats", {
      p_user_id: user.id,
      p_owned_skin_ids: ownedSkinContentIds,
    });

    if (rpcError) throw rpcError;

    const stats = rpcData as unknown as SkinSocialStats;
    const { totalUsers, usersWithFewer, skinOwnerCounts } = stats;

    // ── п.8 — самый редкий owned скин ────────────────────────────────────────
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

    // ── п.16 — перцентиль ────────────────────────────────────────────────────
    const percentile =
      totalUsers > 0 ? Math.round((usersWithFewer / totalUsers) * 100) : 0;

    // ── Ранг коллекции ───────────────────────────────────────────────────────

    // 1. Completeness (0–40): owned / total скинов
    const completeness =
      allSkins.length > 0
        ? (ownedSkinIds.size / allSkins.length) * 40
        : 0;

    // 2. Rarity score (0–35): взвешенная сумма owned скинов по редкости
    const ownedSkins = allSkins.filter((s) => ownedSkinIds.has(s.contentId));
    const maxPossibleRarityScore = allSkins.reduce(
      (sum, s) => sum + (RARITY_WEIGHTS[s.rarity] ?? 0),
      0
    );
    const actualRarityScore = ownedSkins.reduce(
      (sum, s) => sum + (RARITY_WEIGHTS[s.rarity] ?? 0),
      0
    );
    const rarity =
      maxPossibleRarityScore > 0
        ? (actualRarityScore / maxPossibleRarityScore) * 35
        : 0;

    // 3. Completionist score (0–25): завершённые линейки + завершённые чемпионы
    // Линейки (≥2 скинов)
    const skinlineMap = new Map<string, { total: number; owned: number }>();
    for (const skin of allSkins) {
      for (const sl of skin.skinlines) {
        if (!skinlineMap.has(sl.id)) skinlineMap.set(sl.id, { total: 0, owned: 0 });
        const entry = skinlineMap.get(sl.id)!;
        entry.total++;
        if (ownedSkinIds.has(skin.contentId)) entry.owned++;
      }
    }
    const validSkinlines = [...skinlineMap.values()].filter((e) => e.total >= MIN_SKINLINE_SIZE);
    const completedSkinlines = validSkinlines.filter((e) => e.owned === e.total).length;

    // Чемпионы
    const championMap = new Map<string, { total: number; owned: number }>();
    for (const skin of allSkins) {
      if (!championMap.has(skin.championId)) championMap.set(skin.championId, { total: 0, owned: 0 });
      const entry = championMap.get(skin.championId)!;
      entry.total++;
      if (ownedSkinIds.has(skin.contentId)) entry.owned++;
    }
    const completedChampions = [...championMap.values()].filter(
      (e) => e.owned === e.total && e.total > 0
    ).length;

    const maxCompletionist = validSkinlines.length + championMap.size;
    const actualCompletionist = completedSkinlines + completedChampions;
    const completionist =
      maxCompletionist > 0
        ? (actualCompletionist / maxCompletionist) * 25
        : 0;

    const score = Math.round(completeness + rarity + completionist);

    const collectionRank: CollectionRankData = {
      score,
      rank: getRank(score),
      breakdown: {
        completeness: Math.round(completeness * 100) / 100,
        rarity: Math.round(rarity * 100) / 100,
        completionist: Math.round(completionist * 100) / 100,
      },
    };

    const response: StatsSocialResponse = {
      rarestSkin,
      comparedToAverage: { percentile, totalPlayers: totalUsers },
      collectionRank,
    };

    return Response.json(response);
  } catch (error) {
    return errorHandler(error);
  }
};