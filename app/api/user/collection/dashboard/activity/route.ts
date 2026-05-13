import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { createClient } from "@/lib/supabase/server";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import { getServerUser } from "@/shared/utils/getServerUser";
import { MonthlyActivity, StatsActivityResponse } from "@/types/dashboard";

export const GET = async (_req: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const lng = cookieStore.get("i18next")?.value ?? "en";

    const user = await getServerUser();
    const appData = await getLangAppData(getLanguageCode(lng));
    const supabase = await createClient();

    const allSkins = (appData?.skins ?? []).filter((s) => !s.pbe);
    const skinByContentId = new Map(allSkins.map((s) => [s.contentId, s]));

    const { data: userSkins, error } = await supabase
      .from("user_skins")
      .select("contentId, purchased_date")
      .eq("user_id", user.id)
      .order("purchased_date", { ascending: true });

    if (error) throw error;

    const skinsWithDate = (userSkins ?? []).filter((row): row is { contentId: string; purchased_date: string } => row.purchased_date !== null);

    if (skinsWithDate.length === 0) {
      const response: StatsActivityResponse = {
        timeline: [],
        recentSkins: [],
        biggestYear: null,
        longestStreak: null,
        averagePerMonth: 0,
      };
      return Response.json(response);
    }

    const monthCountMap = new Map<string, number>();
    for (const row of skinsWithDate) {
      const date = new Date(row.purchased_date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthCountMap.set(key, (monthCountMap.get(key) ?? 0) + 1);
    }

    const timeline: MonthlyActivity[] = [...monthCountMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));

    const recentSkins = skinsWithDate
      .slice(-5)
      .reverse()
      .map((row) => {
        const skin = skinByContentId.get(row.contentId);
        return skin;
      })
      .filter((s) => !!s);

    const yearCountMap = new Map<number, number>();
    for (const row of skinsWithDate) {
      const year = new Date(row.purchased_date).getFullYear();
      yearCountMap.set(year, (yearCountMap.get(year) ?? 0) + 1);
    }

    const biggestYearEntry = [...yearCountMap.entries()].sort((a, b) => b[1] - a[1])[0];
    const biggestYear = biggestYearEntry ? { year: biggestYearEntry[0], count: biggestYearEntry[1] } : null;

    let longestStreak: StatsActivityResponse["longestStreak"] = null;

    if (skinsWithDate.length >= 2) {
      let maxDays = 0;
      let maxFrom = "";
      let maxTo = "";

      for (let i = 1; i < skinsWithDate.length; i++) {
        const prev = new Date(skinsWithDate[i - 1].purchased_date);
        const curr = new Date(skinsWithDate[i].purchased_date);
        const days = Math.round((curr.getTime() - prev.getTime()) / 86_400_000);

        if (days > maxDays) {
          maxDays = days;
          maxFrom = prev.toISOString();
          maxTo = curr.toISOString();
        }
      }

      if (maxDays > 0) {
        longestStreak = { days: maxDays, from: maxFrom, to: maxTo };
      }
    }

    const averagePerMonth = timeline.length > 0 ? Math.round((skinsWithDate.length / timeline.length) * 100) / 100 : 0;

    const response: StatsActivityResponse = {
      timeline,
      recentSkins,
      biggestYear,
      longestStreak,
      averagePerMonth,
    };

    return Response.json(response);
  } catch (error) {
    return errorHandler(error);
  }
};
