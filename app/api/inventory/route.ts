import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { errorHandler, RequestError } from "@/errors";
import { verifyAccessToken } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { parseRiotDate } from "@/shared/utils/parseRiotDate";

const BATCH_SIZE = 200;

interface InventoryItem {
  expirationDate: string;
  f2p: boolean;
  inventoryType: "CHAMPION_SKIN";
  itemId: number;
  loyalty: boolean;
  loyaltySources: unknown[];
  ownershipType: "OWNED";
  purchaseDate: string;
  quantity: number;
  rental: boolean;
  usedInGameDate: string;
  uuid: string;
  wins: number;
}

interface OwnedRow {
  userId: string;
  contentId: string;
  purchased_date: string;
}

const insertInBatches = async (supabase: Awaited<ReturnType<typeof createClient>>, table: "user_skins" | "user_chromas", rows: OwnedRow[]) => {
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from(table).insert(batch);
    if (error) throw error;
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const supabase = await createClient();
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) throw new RequestError({ code: "ERR_0001", status: 401 });

    const payload = verifyAccessToken(accessToken);
    if (!payload) throw new RequestError({ code: "ERR_0001", status: 401 });

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json({ ok: false, error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    const inventory = (JSON.parse(text) as InventoryItem[]).sort((a, b) => {
      const dateA = parseRiotDate(a.purchaseDate).getTime();
      const dateB = parseRiotDate(b.purchaseDate).getTime();
      return dateB - dateA;
    });

    const appData = await getLangAppData();
    const skins = appData?.skins ?? [];
    const chromas = appData?.chromas ?? [];

    const skinContentIds = new Set(skins.map((s) => s.contentId));
    const chromaContentIds = new Set(chromas.map((c) => c.contentId));

    const skinRows = inventory
      .filter((item) => skinContentIds.has(item.uuid))
      .map((item) => ({
        userId: payload.userId,
        contentId: item.uuid,
        purchased_date: parseRiotDate(item.purchaseDate).toISOString(),
      }));

    const chromaRows = inventory
      .filter((item) => chromaContentIds.has(item.uuid))
      .map((item) => ({
        userId: payload.userId,
        contentId: item.uuid,
        purchased_date: parseRiotDate(item.purchaseDate).toISOString(),
      }));

    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/sync_user_inventory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!}`,
      },
      body: JSON.stringify({
        p_user_id: payload.userId,
        p_skins: skinRows,
        p_chromas: chromaRows,
      }),
    });

    console.log("status:", res.status);
    const body = await res.text();
    console.log("body:", body);

    // console.log("calling rpc, skins:", skinRows.length, "chromas:", chromaRows.length);
    // const { error } = await supabase.rpc("sync_user_inventory", {
    //   p_user_id: payload.userId,
    //   p_skins: skinRows,
    //   p_chromas: chromaRows,
    // });

    // console.log("rpc done, error:", error);

    // if (error) throw error;

    await insertInBatches(supabase, "user_skins", skinRows);
    await insertInBatches(supabase, "user_chromas", chromaRows);

    return Response.json({ ok: true });
  } catch (error) {
    return errorHandler(error);
  }
};
