"use client";
import Link from "next/link";
import { useT } from "next-i18next/client";
import { type FC, type ReactNode } from "react";

import ChromaColor from "@/components/ChromaColor";
import Image from "@/components/Image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/shared/cn";
import { RARITIES } from "@/shared/constants/rarities";
import { AppDataSkin } from "@/types/appdata";

interface SkinCardProps {
  className?: string;
  data: AppDataSkin;
  owned?: boolean;
  actions?: ReactNode;
}

const SkinCard: FC<SkinCardProps> = ({ className, data, owned, actions }) => {
  const { t } = useT();

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <Link
        href={`/skins/${data.contentId}`}
        className="block relative group aspect-[1/1.2] rounded-md overflow-hidden focus:border-2 focus:border-ring transition-shadow hover:shadow-md/30"
      >
        <Image
          src={data.questSkinInfo?.splashPath ?? data.image.centered ?? ""}
          className="object-cover size-full transition-all group-hover:scale-[1.1] group-focus:scale-[1.1]"
        />

        {data.video?.centered && (
          <video
            src={data.video.centered}
            autoPlay
            muted
            loop
            crossOrigin="anonymous"
            className="absolute z-1 top-0 left-0 size-full object-cover transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none"
          />
        )}

        <div className="absolute z-2 top-1.5 left-1.5 flex items-center gap-x-1">
          {data.pbe && <Badge className='rounded-sm'>PBE</Badge>}
          {data.rarity !== "kNoRarity" && (
            <Badge className="text-neutral-800 rounded-sm" style={{ background: RARITIES[data.rarity]?.color }}>
              {t(`rarity.${data.rarity}`)}
            </Badge>
          )}
        </div>

        {owned && <Badge className="absolute z-2 top-1.5 right-1.5 rounded-sm bg-success">{t('skin.owned')}</Badge>}

        {!!data.chromas.length && (
          <div className="flex items-center flex-wrap absolute left-1.5 bottom-1.5 z-2 gap-x-1">
            {data.chromas.slice(0, 3).map((chroma) => (
              <ChromaColor key={chroma.id} colors={chroma.colors} className="size-5 rounded-sm border-none" />
            ))}
            {data.chromas.length > 3 && (
              <div className="size-5 aspect-square shrink-0 text-[10px] z-5 rounded-sm text-neutral-50 bg-neutral-800 flex items-center justify-center">
                +{data.chromas.length - 3}
              </div>
            )}
          </div>
        )}
      </Link>

      <div className="flex items-center justify-between min-h-7">
        <span className="text-sm text-muted-foreground font-medium mr-auto">{data.championName}</span>
        {actions}
      </div>

      <Link href={`/skins/${data.contentId}`} className="font-medium line-clamp-2 hover:underline w-fit" tabIndex={-1}>
        {data.name}
      </Link>
    </div>
  );
};

export default SkinCard;
