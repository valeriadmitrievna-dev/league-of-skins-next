"use client";
import { BookmarkIcon, HeartIcon } from "lucide-react";
import Link from "next/link";
import { useT } from "next-i18next/client";
import { type FC } from "react";
import { toast } from "sonner";

import ChromaColor from "@/components/ChromaColor";
import Image from "@/components/Image";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/shared/cn";
import { RARITIES } from "@/shared/constants/rarities";
import { AppDataSkin } from "@/types/appdata";

import WishlistDialog from "../Wishlist/WishlistDialog";

interface SkinCardProps {
  className?: string;
  data: AppDataSkin;
  owned?: boolean | "hidden";
  addToWishlistButton?: boolean;
  toggleOwnedButton?: boolean;
  wishlistId?: string;
}

const SkinCard: FC<SkinCardProps> = ({ className, data, owned, addToWishlistButton, toggleOwnedButton }) => {
  const { t } = useT();

  const toggleOwnedHandler = async () => {
    if (owned) {
      toast.success("Образ удален из купленных");
    } else {
      toast.success("Образ отмечен как купленный");
    }
  };

  //   const removeFromWishlistHandler = async () => {
  //     try {
  //       if (wishlistId) {
  //         await updateWishlist({ wishlistId, body: { removeSkinIds: [data.contentId] } });
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  return (
    <div
      className={cn(
        "h-full flex flex-col",
        {
          //   "pointer-events-none": isOwningUpdating || isWishlistUpdating,
        },
        className,
      )}
    >
      <Link
        href={`/skins/${data.contentId}`}
        className="block relative group aspect-[1/1.2] rounded-md overflow-hidden focus:border-2 focus:border-ring"
      >
        <Image
          src={data.questSkinInfo?.splashPath ?? data.image.centered ?? ""}
          className="object-cover size-full transition-all group-hover:scale-[1.1] group-focus:scale-[1.1]"
        />

        {/* Video preview */}
        {data.video && data.video.centered && (
          <video
            src={data.video.centered}
            autoPlay
            muted
            loop
            crossOrigin="anonymous"
            className="absolute z-1 top-0 left-0 size-full object-cover transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none"
          />
        )}

        {data.rarity !== "kNoRarity" && (
          <Badge className="absolute z-2 top-1.5 left-1.5 text-neutral-800" style={{ background: RARITIES[data.rarity]?.color }}>
            {t(`rarity.${data.rarity}`)}
          </Badge>
        )}

        {data.pbe && <Badge className="absolute z-2 top-1.5 right-1.5">PBE</Badge>}

        {data.sale && !data.pbe && (
          <Badge variant="destructive" className="absolute z-2 top-1.5 right-1.5">
            -{Math.round(data.sale.discount * 100)}%
          </Badge>
        )}

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
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium mr-auto">{data.championName}</span>
        {toggleOwnedButton &&
          !data.pbe &&
          (false ? (
            <Spinner className="size-5 my-1 mr-0.5 text-primary shrink-0 select-none" />
          ) : (
            <BookmarkIcon
              onClick={toggleOwnedHandler}
              className={cn("size-7 p-1 pr-0 cursor-pointer text-primary shrink-0 select-none", {
                "hover:fill-primary/50": !owned,
                "fill-primary": owned,
              })}
            />
          ))}
        {addToWishlistButton && (
          <WishlistDialog
            skinName={data.name}
            skinContentIds={[data.contentId]}
            trigger={({ onOpen, isSkinInWishlist }) => (
              <HeartIcon
                onClick={onOpen}
                className={cn("size-7 p-1 pr-0 text-destructive cursor-pointer shrink-0 select-none", {
                  "fill-destructive": isSkinInWishlist,
                  "hover:fill-destructive/50": !isSkinInWishlist,
                })}
              />
            )}
          />
        )}

        {/* {wishlistId &&
          (isWishlistUpdating ? (
            <Spinner className="size-5 my-1 text-primary shrink-0" />
          ) : (
            <HeartIcon
              onClick={removeFromWishlistHandler}
              className="size-7 p-1 pr-0 text-destructive cursor-pointer fill-destructive shrink-0"
            />
          ))} */}
      </div>
      <Link href={`/skins/${data.contentId}`} className="font-medium line-clamp-2 hover:underline w-fit" tabIndex={-1}>
        {data.name}
      </Link>
    </div>
  );
};

export default SkinCard;
