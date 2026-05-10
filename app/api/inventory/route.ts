import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { errorHandler, RequestError } from "@/errors";
import { verifyAccessToken } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { parseRiotDate } from "@/shared/utils/parseRiotDate";

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

export const maxDuration = 60;

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
        user_id: payload.userId,
        contentId: item.uuid,
        purchased_date: parseRiotDate(item.purchaseDate).toISOString(),
      }));

    const chromaRows = inventory
      .filter((item) => chromaContentIds.has(item.uuid))
      .map((item) => ({
        user_id: payload.userId,
        contentId: item.uuid,
        purchased_date: parseRiotDate(item.purchaseDate).toISOString(),
      }));

    const { error: skinsError } = await supabase.rpc("bulk_upsert_skins", {
      rows: skinRows,
    });
    if (skinsError) throw skinsError;

    const { error: chromasError } = await supabase.rpc("bulk_upsert_chromas", {
      rows: chromaRows,
    });
    if (chromasError) throw chromasError;

    return Response.json({ ok: true });
  } catch (error) {
    return errorHandler(error);
  }
};
