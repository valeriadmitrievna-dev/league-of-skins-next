"use client";

import { PlayIcon } from "lucide-react";
import Link from "next/link";
import { useT } from "next-i18next/client";
import { FC } from "react";

import ChromaColor from "@/components/ChromaColor";
import Image from "@/components/Image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/cn";
import { RARITIES } from "@/shared/constants/rarities";
import { AppDataSkin } from "@/types/appdata";

import SkinInfoLine from "./SkinInfoLine";

interface SkinInfoProps {
  data: AppDataSkin;
  className?: string;
}

const SkinInfo: FC<SkinInfoProps> = ({ data, className }) => {
  const { t } = useT();
  const rarityData = data.rarity ? RARITIES[data.rarity] : undefined;

  const chromaScrollHandler = (chromaId: string) => {
    const chromaView = document.getElementById(`chromaView-${chromaId}`);

    if (chromaView) {
      chromaView.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });

      chromaView.setAttribute("data-state", "on");

      setTimeout(() => {
        chromaView.removeAttribute("data-state");
      }, 1000);
    }
  };

  return (
    <aside className={cn("flex flex-col gap-y-3", className)}>
      <div className="my-card pt-6! pb-5! px-4! text-xs h-fit relative">
        {/* {isOwned && (
          <Badge className="absolute bg-background gap-x-1.5 -top-2.5 right-4" variant="outline">
            <BadgeCheckIcon className="scale-120 text-sky-500 dark:text-blue-600" />
            {t("skin.owned")}
          </Badge>
        )} */}
        <SkinInfoLine
          title={t("filters.champion")}
          info={
            <Badge className="border-none gap-x-1.5" asChild>
              <Link href={"/search/skins?championId=" + data.championId}>{data.championName}</Link>
            </Badge>
          }
        />
        <SkinInfoLine
          title={t("filters.rarity")}
          info={
            <Badge className="gap-x-1.5 border-none" asChild>
              <Link href={"/search/skins?rarity=" + data.rarity}>
                {RARITIES?.icon && <Image src={rarityData?.icon} className="size-4" alt={t(`rarity.${data.rarity}`)} />}
                {t(`rarity.${data.rarity}`)}
              </Link>
            </Badge>
          }
        />
        {/* {!!data?.release && (
          <SkinInfoLine title={t("skin.release")} info={format(new Date(data.release * 1000), "dd.MM.yyyy")} />
        )}
        {!!data?.price && (
          <SkinInfoLine
            title={t("skin.price")}
            info={
              <div className="font-medium flex items-center gap-1">
                <span className="leading-none">{data.price}</span>
                <RPIcon className="size-3.5" />
              </div>
            }
          />
        )} */}
        <SkinInfoLine
          title={t("rarity.legacy")}
          info={<span className="pr-2 font-medium">{t(`shared.${data.isLegacy ? "yes" : "no"}`)}</span>}
        />
      </div>
      {!!data.chromas?.length && (
        <div className="my-card px-4! text-xs h-fit">
          <p className="mb-2">{t("skin.chromas")}</p>
          <div className="flex flex-wrap gap-2">
            {data.chromas.map((chroma) => (
              <ChromaColor key={chroma.contentId} colors={chroma.colors} onClick={() => chromaScrollHandler(chroma.id)} />
            ))}
          </div>
        </div>
      )}
      {data.chromaPath && (
        <div className="mt-3 my-card py-3 pt-7! px-4! md:aspect-square text-xs h-fit relative bg-muted flex justify-center">
          <Badge variant="outline" className="bg-background absolute -top-2.5 left-1/2 transform -translate-x-1/2">
            {t("skin.baseChroma")}
          </Badge>
          <Image src={data.chromaPath} className="max-w-[85%] h-fit aspect-90/101" />
        </div>
      )}
      {/* <AddToWishlist
        skinName={data.name}
        skinContentIds={[data.contentId]}
        trigger={({ onOpen }) => <Button onClick={onOpen}>{t("skin.add")}</Button>}
      /> */}
      {/* {isAuth && (
        <Button variant="outline" onClick={toggleOwnedHandler} disabled={isOwningUpdating}>
          {isOwningUpdating && <Spinner />}
          {isOwned ? t("skin.unmarkOwnedTooltip") : t("skin.markOwnedTooltip")}
        </Button>
      )} */}
      <Button variant="outline" asChild>
        <Link
          href={`https://www.youtube.com/results?search_query=${(data.originName || data.name).toLowerCase().split(" ").join("+")}+spotlight`}
          target="_blank"
        >
          <PlayIcon />
          {t("skin.spotlight")}
        </Link>
      </Button>
    </aside>
  );
};

export default SkinInfo;
