"use client";
import { formatDistanceToNow } from "date-fns";
import { EllipsisIcon, Share2Icon, SquarePenIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useT } from "next-i18next/client";
import { CSSProperties, FC, MouseEvent } from "react";

import Image from "@/components/Image";
import { Typography } from "@/components/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import useShare from "@/hooks/useShare";
import { DATE_LOCALE } from "@/shared/constants/date_locales";
import { DbWishlist, DbWishlistPreview } from "@/types/db";

import WishlistDelete from "./WishlistDelete";

interface WishlistCardProps extends DbWishlist, DbWishlistPreview {
  guest?: boolean;
}

const WishlistCard: FC<WishlistCardProps> = ({ guest, ...data }) => {
  const { t, i18n } = useT();
  const { share } = useShare();

  const percent = ((data.owned.skins + data.owned.chromas) / (data.skins.length + data.chromas.length)) * 100;

  const shareHandler = (event: MouseEvent<HTMLDivElement>) => {
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
    <div className="relative flex flex-col justify-between bg-card rounded-md border overflow-hidden group transition-shadow hover:shadow-lg/50">
      <Link
        href={`/wishlists/${guest ? data.link : data.id}`}
        className="bg-accent/20 max-h-40 grid overflow-hidden grid-cols-3"
        style={{ "--columns": [...data.preview.skins, ...data.preview.chromas].slice(0, 3).length } as CSSProperties}
      >
        {[...data.preview.skins, ...data.preview.chromas].slice(0, 3).map((url) => (
          <Image key={url} src={url ?? ""} className="aspect-5/6 object-cover size-full not-last:border-r border-card" />
        ))}
      </Link>

      <div className="px-4 py-3 border-t w-full overflow-hidden">
        <div className="flex items-center justify-between gap-x-2 mb-2">
          <Typography.Large className="truncate">{data.name}</Typography.Large>
          <Badge variant={data.private ? "muted" : "primary-muted"}>{t(`wishlist.private_${data.private}`)}</Badge>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {data.skins.length + data.chromas.length} {t("shared.item", { count: data.skins.length + data.chromas.length })}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Progress value={percent} />
          <Typography.Small>{Math.round(percent)}%</Typography.Small>
        </div>
      </div>

      <div className="px-4 py-3 border-t w-full overflow-hidden flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <p className="text-xs text-muted-foreground">{data.user.name}</p>
          <p className="text-sm text-muted-foreground">
            {t("wishlist.updated")} {formatDistanceToNow(new Date(data.updated_at), { locale: DATE_LOCALE[i18n.language] })}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top">
            <DropdownMenuItem>
              <SquarePenIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={shareHandler}>
              <Share2Icon />
              Share
            </DropdownMenuItem>
            <WishlistDelete
              id={data.id}
              trigger={
                <DropdownMenuItem variant="destructive">
                  <TrashIcon />
                  Delete
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default WishlistCard;
