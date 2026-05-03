import { endpoint } from "@/lib/endpoint";
import { getLangAppData } from "@/shared/utils/getLangAppData";

export const GET = endpoint(async () => {
  const appData: any = await getLangAppData();
  const rarities = new Set([...(appData?.skins ?? []).map((s: any) => s.rarity)]);

  return [...rarities];
});
