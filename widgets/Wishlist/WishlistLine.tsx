import { CircleMinusIcon, CirclePlusIcon } from "lucide-react";
import Link from "next/link";
import { FC, MouseEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DbWishlist } from '@/types/db';

interface WishlistLineProps {
  wishlist: DbWishlist;
  skinContentIds?: string[];
  chromaContentIds?: string[];
}

const WishlistLine: FC<WishlistLineProps> = ({ wishlist, skinContentIds = [], chromaContentIds = [] }) => {
  const addToExistingWishlist = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // await updateWishlist({ wishlistId: wishlist.id, body: { addSkinIds: skinContentIds, addChromaIds: chromaContentIds } });

    if (skinContentIds.length) {
      if (skinContentIds.length === 1) {
        toast.success("Образ добавлен в вишлист");
      } else if (skinContentIds.length > 1) {
        toast.success("Образы добавлены в вишлист");
      }
    }

    if (chromaContentIds.length) {
      if (chromaContentIds.length === 1) {
        toast.success("Цветовая схема добавлена в вишлист");
      } else if (chromaContentIds.length > 1) {
        toast.success("Цветовые схемы добавлены в вишлист");
      }
    }
  };

  const removeFromExistingWishlist = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // await updateWishlist({
    //   wishlistId: wishlist.id,
    //   body: { removeSkinIds: skinContentIds, removeChromaIds: chromaContentIds },
    // });

    if (skinContentIds.length) {
      if (skinContentIds.length === 1) {
        toast.success("Образ удален из вишлиста");
      } else {
        toast.success("Образы удалены из вишлиста");
      }
    }

    if (chromaContentIds.length) {
      if (chromaContentIds.length === 1) {
        toast.success("Цветовая схема удалена из вишлиста");
      } else if (chromaContentIds.length > 1) {
        toast.success("Цветовые схемы удалены из вишлиста");
      }
    }
  };

  const isSkinInWishlist = skinContentIds.every((skinContentId) => wishlist.skins.includes(skinContentId));
  const isChromaInWishlist = chromaContentIds.every((chromaContentId) => wishlist.chromas.includes(chromaContentId));
  const isInWishlist = isSkinInWishlist && isChromaInWishlist;

  const isWishlistUpdating = false;

  return (
    <Link
      href={`/wishlists/${wishlist.id}`}
      role="list-item"
      className="group min-h-10 flex items-center justify-between px-2.5 pr-1 py-1 not-last:border-b hover:bg-input/10 rounded-md"
      key={wishlist.id}
    >
      <span className="text-sm font-medium truncate group-hover:underline">{wishlist.name}</span>
      {isWishlistUpdating && (
        <div className="p-2">
          <Spinner />
        </div>
      )}

      {!isWishlistUpdating && isInWishlist && (
        <Button size="icon-sm" variant="ghost" onClick={removeFromExistingWishlist} className="text-destructive">
          <CircleMinusIcon />
        </Button>
      )}

      {!isWishlistUpdating && !isInWishlist && (
        <Button size="icon-sm" variant="ghost" onClick={addToExistingWishlist}>
          <CirclePlusIcon />
        </Button>
      )}
    </Link>
  );
};

export default WishlistLine;
