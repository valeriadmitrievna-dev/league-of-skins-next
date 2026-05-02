import { SearchParams } from "@/shared/types";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from '@/shared/utils/getLanguageCode';
import SearchSkinsFilters from "@/widgets/SearchSkins/SearchSkinsFilters";
import SearchSkinsInput from "@/widgets/SearchSkins/SearchSkinsInput";
import SearchSkinsResult from "@/widgets/SearchSkins/SearchSkinsResult";
import { isEqual, uniqWith } from "lodash";
import { cookies } from 'next/headers';
import { FC } from "react";

const SearchSkins: FC<{ searchParams: SearchParams }> = async ({ searchParams }) => {
  const params = await searchParams;
  const cookieStore = await cookies();
  const lng = cookieStore.get("i18next")?.value ?? "en";

  const appData: any = await getLangAppData(getLanguageCode(lng));
  const champions = appData?.champions ?? [];
  const skinlines = appData?.skinlines.filter((skinline: any) => skinline.name) ?? [];
  const rarities = [...new Set((appData?.skins ?? []).map((skin: any) => skin.rarity))] as string[];
  const chromas = uniqWith(
    (appData?.skins ?? [])
      .filter((skin: any) => skin.chromas.length)
      .map((skin: any) =>
        skin.chromas?.map((chroma: any) => {
          return {
            id: chroma.id.toString(),
            contentId: chroma.contentId,
            name: chroma.name,
            skinName: skin.name,
            skinContentId: skin.contentId,
            championId: skin.championId,
            colors: chroma.colors,
            path: chroma.path,
            fullName: chroma.fullName,
            pbe: chroma.pbe,
          };
        }),
      )
      .flat(),
    (a: any, b: any) => a.name === b.name && isEqual(a.colors, b.colors),
  );

  return (
    <div className="w-full md:grid grid-cols-[280px_1fr] gap-6">
      <SearchSkinsFilters champions={champions} rarities={rarities} skinlines={skinlines} chromas={chromas} />
      <div className="pb-10">
        <div className="mb-4">
          <SearchSkinsInput />
        </div>
        <SearchSkinsResult params={params} />
      </div>
    </div>
  );
};

export default SearchSkins;
