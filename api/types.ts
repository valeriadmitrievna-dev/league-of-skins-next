import { PaginatedRequest } from "@/shared/types";

export type SearchSkinsRequest = PaginatedRequest<{
  championId?: string;
  skinlineId?: string;
  chromaId?: string;
  search?: string;
  rarity?: string;
  legacy?: "all" | "on" | "off";
  owned?: "all" | "on" | "off";
  server?: "all" | "latest" | "pbe";
  hasChroma?: "true" | "false";
}>;

export type SearchChromasRequest = PaginatedRequest<{
  championId?: string;
  skinContentId?: string;
  search?: string;
  owned?: "all" | "on" | "off";
  skin?: "all" | "on" | "off";
  server?: "all" | "latest" | "pbe";
}>;

export type WishlistElementsPatch = {
  addSkins?: string[];
  addChromas?: string[];
  removeSkins?: string[];
  removeChromas?: string[];
}
