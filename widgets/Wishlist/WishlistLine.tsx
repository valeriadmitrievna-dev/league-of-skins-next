import { useMutation } from "@tanstack/react-query";
import { CircleMinusIcon, CirclePlusIcon } from "lucide-react";
import { FC, MouseEvent } from "react";
import { toast } from "sonner";

import { WishlistElementsPatch } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { fetchClient } from "@/lib/fetchClient";
import { cn } from "@/shared/cn";
import { WithClassName } from "@/shared/types";
import { DbWishlist } from "@/types/db";

interface WishlistLineProps {
  wishlist: DbWishlist;
  skinContentIds?: string[];
  chromaContentIds?: string[];
}

const WishlistLine: FC<WithClassName<WishlistLineProps>> = ({ wishlist, skinContentIds = [], chromaContentIds = [], className }) => {
  const { mutate: updateWishlist, isPending } = useMutation({
    mutationFn: ({ id, ...body }: { id: string } & WishlistElementsPatch) =>
      fetchClient("/api/wishlists/" + id, { method: "PATCH", body: JSON.stringify(body) }),
    onSuccess: async (data, body, _, { client }) => {
      client.setQueryData(["userWishlists"], (prev: DbWishlist[]) => {
        return prev.map(w => w.id === body.id ? data : w)
      });

      if (body.addSkins?.length) {
        if (body.addSkins.length === 1) {
          toast.success("Образ добавлен в вишлист");
        } else if (body.addSkins.length > 1) {
          toast.success("Образы добавлены в вишлист");
        }
      }

      if (body.addChromas?.length) {
        if (body.addChromas.length === 1) {
          toast.success("Цветовая схема добавлена в вишлист");
        } else if (body.addChromas.length > 1) {
          toast.success("Цветовые схемы добавлены в вишлист");
        }
      }

      if (body.removeSkins?.length) {
        if (body.removeSkins.length === 1) {
          toast.success("Образ добавлен в вишлист");
        } else if (body.removeSkins.length > 1) {
          toast.success("Образы добавлены в вишлист");
        }
      }

      if (body.removeChromas?.length) {
        if (body.removeChromas.length === 1) {
          toast.success("Цветовая схема добавлена в вишлист");
        } else if (body.removeChromas.length > 1) {
          toast.success("Цветовые схемы добавлены в вишлист");
        }
      }
    },
    onError: (...error) => {
      console.log("[DEV]", error);
      toast.error("Ошибка при изменении вишлиста");
    },
  });

  const addToExistingWishlist = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    updateWishlist({ id: wishlist.id, addSkins: skinContentIds, addChromas: chromaContentIds });
  };

  const removeFromExistingWishlist = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    updateWishlist({ id: wishlist.id, removeSkins: skinContentIds, removeChromas: chromaContentIds });
  };

  const isSkinInWishlist = skinContentIds.every((skinContentId) => wishlist.skins.includes(skinContentId));
  const isChromaInWishlist = chromaContentIds.every((chromaContentId) => wishlist.chromas.includes(chromaContentId));
  const isInWishlist = isSkinInWishlist && isChromaInWishlist;

  return (
    <div
      role="list-item"
      className={cn("group min-h-10 flex items-center justify-between px-2.5 pr-1 py-1 hover:bg-input/10 rounded-md", className)}
      key={wishlist.id}
    >
      <span className="text-sm font-medium truncate">{wishlist.name}</span>
      {isPending && (
        <div className="p-2">
          <Spinner />
        </div>
      )}

      {!isPending && isInWishlist && (
        <Button size="icon-sm" variant="ghost" onClick={removeFromExistingWishlist} className="text-destructive!">
          <CircleMinusIcon />
        </Button>
      )}

      {!isPending && !isInWishlist && (
        <Button size="icon-sm" variant="ghost" onClick={addToExistingWishlist}>
          <CirclePlusIcon />
        </Button>
      )}
    </div>
  );
};

export default WishlistLine;
