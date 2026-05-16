import { Tables } from "@/lib/supabase/types";
import { CDragonAsset } from "@/shared/types";

export type DbUser = Tables<"users">;
export type DbWishlist = Tables<"wishlists">;

export type DbWishlistPreview = {
  preview: {
    skins: CDragonAsset[];
    chromas: CDragonAsset[];
  };
  owned: {
    skins: number;
    chromas: number;
  };
  price: {
    total: number;
    owned: number;
  };
  user: DbUser;
};
