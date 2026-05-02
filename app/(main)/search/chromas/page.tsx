import { SearchParams } from "@/shared/types";
import { getLangAppData } from "@/shared/utils/getLangAppData";
import { getLanguageCode } from "@/shared/utils/getLanguageCode";
import SearchChromasFilters from "@/widgets/SearchChromas/SearchChromasFilters";
import SearchChromasInput from "@/widgets/SearchChromas/SearchChromasInput";
import SearchChromasResult from "@/widgets/SearchChromas/SearchChromasResult";
import { getT } from "next-i18next/server";
import { cookies } from "next/headers";
import { FC } from "react";

const SearchChromas: FC<{ searchParams: SearchParams }> = async ({ searchParams }) => {
  const params = await searchParams;
  const cookieStore = await cookies();
  const lng = cookieStore.get("i18next")?.value ?? "en";

  const appData: any = await getLangAppData(getLanguageCode(lng));
  const champions = appData?.champions ?? [];
  const skins =
    !appData || !params.championId
      ? []
      : (appData.skins ?? []).filter((skin: any) => skin.championId === params.championId && skin.chromas.length);

  return (
    <div className="w-full md:grid grid-cols-[280px_1fr] gap-6">
      <SearchChromasFilters champions={champions} skins={skins} />
      <div className="pb-10">
        <div className="mb-4">
          <SearchChromasInput />
        </div>
        <SearchChromasResult params={params} />
      </div>
    </div>
  );
};

export default SearchChromas;
