import { AppDataChroma } from "@/types/appdata";

import { CDragonAsset } from "../types";

export const buildWishlistChromasPreview = (wishlist: { chromas: string[] }, appChromas: AppDataChroma[], count = 3): CDragonAsset[] => {
  const skins = wishlist.chromas.map((id) => appChromas.find((c) => c.contentId === id)).filter((c) => !!c);
  return skins.slice(0, count).map((s) => s.path);
};
