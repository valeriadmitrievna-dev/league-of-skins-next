import { publicEndpoint } from "@/lib/endpoint";
import { getLangAppData } from "@/shared/utils/getLangAppData";

export const GET = publicEndpoint(async () => {
  const appData = await getLangAppData();
  const rarities = new Set([...(appData?.skins ?? []).map((s) => s.rarity)]);

  return [...rarities];
});
