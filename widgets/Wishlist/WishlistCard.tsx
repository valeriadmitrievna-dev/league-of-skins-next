"use client";
import { LockIcon, LockOpenIcon, Share2Icon, TrashIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { useT } from "next-i18next/client";
import { FC, MouseEvent } from "react";

import { ImageStack } from "@/components/ImageStack";
import { Typography } from "@/components/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useShare from "@/hooks/useShare";
import { CDragonAsset } from "@/shared/types";
import { DbWishlist } from "@/types/db";

import WishlistDelete from "./WishlistDelete";

interface WishlistCardProps extends DbWishlist {
  preview: CDragonAsset[];
  userName?: string;
  guest?: boolean;
}

const WishlistCard: FC<WishlistCardProps> = ({ guest, userName, ...data }) => {
  const { t } = useT();
  const { share } = useShare();

  const shareHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    share(
      { title: data.name, url: `${window.location.origin}/wishlists/${data.link}` },
      {
        error: "Ошибка при попытке поделиться",
      },
    );
  };

  return (
    <div className="relative flex flex-col justify-between bg-card rounded-md overflow-hidden group transition-shadow hover:shadow-lg/50">
      {!guest && (
        <Badge variant={data.private ? "destructive" : "default"} className="absolute z-5 top-2 left-2">
          {data.private ? <LockIcon /> : <LockOpenIcon />}
          {t(`wishlist.private_${data.private}`)}
        </Badge>
      )}

      <Link href={`/wishlists/${guest ? data.link : data.id}`} className="bg-accent">
        <ImageStack images={(data.preview ?? []).map((i) => i ?? "")} />
      </Link>

      <div className="px-4 py-3 min-h-24 flex flex-col gap-y-2">
        <Typography.Large className="line-clamp-3">{data.name}</Typography.Large>

        <div className="mt-auto w-full flex items-end gap-2">
          <div className="flex items-center gap-2 mr-auto flex-wrap">
            {guest && userName && (
              <Badge variant="secondary">
                <UserRoundIcon />
                {userName}
              </Badge>
            )}
            <div className="flex items-center gap-2 mr-auto">
              <Typography.Muted>
                {data?.skins?.length > 999 ? "999+" : data?.skins?.length}{" "}
                {t("shared.skin", { count: data?.skins?.length > 999 ? 999 : data?.skins?.length })}
              </Typography.Muted>
              <Separator orientation="vertical" className="h-3!" />
              <Typography.Muted>
                {data?.chromas?.length > 999 ? "999+" : data?.chromas?.length}{" "}
                {t("shared.chroma", { count: data?.chromas?.length > 999 ? 999 : data?.chromas?.length })}
              </Typography.Muted>
            </div>
          </div>
          {!data.private && !guest && (
            <Button size="icon" variant="outline" onClick={shareHandler}>
              <Share2Icon />
            </Button>
          )}
          {!guest && (
            <WishlistDelete
              id={data.id}
              trigger={
                <Button size="icon" variant="outline" className="border-destructive/30! text-destructive! hover:bg-destructive/10!">
                  <TrashIcon />
                </Button>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
