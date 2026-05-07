import { AppDataSkin } from "@/types/appdata";

import { CDragonAsset } from "../types";

export const buildWishlistPreview = (wishlist: { skins: string[] }, appSkins: AppDataSkin[]): CDragonAsset[] => {
  const skins = wishlist.skins.map((id) => appSkins.find((s) => s.contentId === id)).filter((s) => !!s);
  return skins.slice(0, 5).map((s) => s.image.centered);
};
