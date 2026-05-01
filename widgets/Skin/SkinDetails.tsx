"use client";

import { FC, useCallback } from "react";
import Image from "@/components/Image";
import { Typography } from "@/components/Typography";
import { Badge } from "@/components/ui/badge";
import Video from "@/components/Video";
import VirtualizedGrid from "@/widgets/VirtualizedGrid";
import Link from "next/link";
import { cn } from "@/shared/cn";
import ChromaCard from "../ChromaCard";
import { useT } from "next-i18next/client";

interface SkinDetailsProps {
  data: any;
  className?: string;
}

const SkinDetails: FC<SkinDetailsProps> = ({ data, className }) => {
  const { t } = useT();

  const renderChroma = useCallback(
    (item: unknown, _index: number) => {
      const chroma = item as any;
      // const owned = ownedSet.has(chroma.contentId);

      return (
        <ChromaCard
          id={`chromaView-${chroma.id}`}
          data={chroma}
          // owned={owned}
          addToWishlistButton
          // toggleOwnedButton={Boolean(user)}
          plain
        />
      );
    },
    // [user, ownedSet],
    [],
  );

  return (
    <div className={cn("", className)}>
      <div className="overflow-hidden rounded-md border border-foreground/15 bg-foreground/5 relative">
        {!data.video && !data.questSkinInfo && (
          <Image src={data.image.uncentered!} className="object-cover aspect-405/239 w-full" />
        )}
        {data.video && !data.questSkinInfo && (
          <Video src={data.video.uncentered!} autoPlay muted loop className="object-cover aspect-405/239 w-full" />
        )}
        {data.questSkinInfo && (
          <Image src={data.questSkinInfo.uncenteredSplashPath ?? ""} className="object-cover aspect-405/239 w-full" />
        )}
      </div>

      <div className="mt-5 flex wrap-normal gap-2">
        {data.skinlines.map((skinline: any) => (
          <Link href={"/search/skins?skinlineId=" + String(skinline.id)} key={skinline.id}>
            <Badge variant="secondary">{skinline.name}</Badge>
          </Link>
        ))}
      </div>
      <Typography.H2 className="mt-2">{data.name}</Typography.H2>
      <Typography.P className="mt-2" dangerouslySetInnerHTML={{ __html: data.description }} />

      {!!data.chromas?.length && (
        <div className="mt-6">
          <Typography.H4 className="mb-4">{t("skin.chromas")}</Typography.H4>
          <VirtualizedGrid items={data.chromas} overscan={4} render={renderChroma} columnGap={16} rowGap={24} />
        </div>
      )}

      {!!data.questSkinInfo && (
        <div className="mt-6">
          <Typography.H4 className="mb-4">{t("skin.quest")}</Typography.H4>
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
            {data.questSkinInfo.tiers.map((tier: any) => (
              <div key={tier.name} className="group relative">
                <span className="absolute top-2 left-2 size-8 flex items-center justify-center bg-neutral-900 text-neutral-100 rounded-md z-10">
                  {tier.stage}
                </span>
                <div className="group relative rounded-md overflow-hidden aspect-405/239 border border-foreground/15 bg-foreground/5">
                  <Image src={tier.uncenteredSplashPath ?? ""} className="size-full object-cover" />
                  <Video
                    src={tier.collectionSplashVideoPath ?? tier.splashVideoPath ?? ""}
                    showError={false}
                    autoPlay
                    muted
                    loop
                    className={"absolute h-full w-full object-cover left-0 top-0 z-5"}
                  />
                </div>
                <Typography.Large className="mt-2">{tier.name}</Typography.Large>
              </div>
            ))}
          </div>
        </div>
      )}

      {!!data.features?.length && (
        <div className="mt-6">
          <Typography.H4 className="mb-4">{t("skin.features")}</Typography.H4>
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            {data.features.map((feature: any) => (
              <div key={feature.description} className="relative overflow-hidden rounded-md aspect-1056/720">
                <Video src={feature.videoPath} className="w-full aspect-1056/720" controls loop />

                <div className="absolute w-full z-10 top-2 left-2">
                  <Image src={feature.iconPath} className="w-[10%] aspect-square" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkinDetails;
