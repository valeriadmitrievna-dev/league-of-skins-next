import { type FC } from "react";

import { Typography } from "@/components/Typography";

// import SkinCard from "@/widgets/Skin/SkinCard";
import SubTitle from "./SubTitle";

const CatalogSection: FC = () => {
  // const params = useMemo(
  //   () => ({
  //     lang: i18n.language,
  //     legacy: "all",
  //     server: "all",
  //     owned: "all",
  //     size: 20,
  //     page: 1,
  //   }),
  //   [i18n.language],
  // );

  // const duplicatedSkins = [...skins, ...skins];

  return (
    <section className="mt-28">
      <SubTitle className="text-center">Каталог</SubTitle>
      <Typography.H2 className="text-center mt-2">Найди свой следующий образ</Typography.H2>
      <Typography.Muted className="mt-2 text-center">
        Фильтруй по чемпиону, редкости, линейке или цветовой схеме
      </Typography.Muted>

      {/* {isLoading || isFetching ? null : (
        <div className="overflow-hidden w-full relative h-85 mt-6">
          <div className="absolute left-0 top-0 flex gap-4 w-max slider-track">
            {duplicatedSkins?.map((skin: SkinDto, index) => (
              <SkinCard key={`${skin.contentId}-${index}`} data={skin} className="w-55 shrink-0" />
            ))}
          </div>
        </div>
      )} */}
    </section>
  );
};

export default CatalogSection;
