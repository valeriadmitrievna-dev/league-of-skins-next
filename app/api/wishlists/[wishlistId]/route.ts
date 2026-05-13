import { NextRequest } from "next/server";

import { errorHandler } from "@/errors";
import { createClient } from "@/lib/supabase/server";

export const DELETE = async (_: NextRequest, { params }: { params: Promise<{ wishlistId: string }> }) => {
  try {
    const supabase = await createClient();
    const { wishlistId } = await params;
    await supabase.from("wishlists").delete().eq("id", wishlistId);
    return Response.json({ ok: true });
  } catch (error) {
    return errorHandler(error);
  }
};
