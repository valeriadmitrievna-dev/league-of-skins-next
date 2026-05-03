import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useT } from "next-i18next/client";
import { useEffect, useState, type FC, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import usePendingWishlist from "@/hooks/usePendingWishlist";
import { setPendingWishlist } from "@/lib/pendingWishlist";
import { cn } from "@/shared/cn";
import { useUser } from "@/shared/providers/UserProvider";
import { DbWishlist } from "@/types/db";

import WishlistCreate from "./WishlistCreate";
import WishlistLine from "./WishlistLine";

interface WishlistDialogProps {
  trigger: (options: {
    openState: boolean;
    onOpen: () => void;
    isSkinInWishlist: boolean;
    isChromaInWishlist: boolean;
  }) => ReactNode;

  skinName?: string;
  skinContentIds?: string[];

  chromaName?: string;
  chromaContentIds?: string[];
}

const WishlistDialog: FC<WishlistDialogProps> = ({
  trigger,
  skinName,
  skinContentIds = [],
  chromaName,
  chromaContentIds = [],
}) => {
  const { t } = useT();
  const router = useRouter();

  const { isAuth } = useUser();
  const pending = usePendingWishlist();

  const [open, setOpen] = useState(false);

  const wishlists: DbWishlist[] = [];

  const allSkins = wishlists.flatMap((w) => w.skins);
  const allChromas = wishlists.flatMap((w) => w.chromas);
  const isSkinInWishlist = skinContentIds.every((id) => allSkins.includes(id));
  const isChromaInWishlist = chromaContentIds.every((id) => allChromas.includes(id));

  const openHandler = () => {
    if (!skinContentIds.length && !chromaContentIds.length) return;

    if (isAuth) {
      setOpen(true);
    } else {
      setPendingWishlist({ skinContentIds, chromaContentIds });
      const pathname = window.location.pathname;
      router.push("/auth/signin?redirect=" + pathname);
    }
  };

  useEffect(() => {
    if (pending?.skinContentIds?.length || pending?.chromaContentIds?.length) {
      setOpen(true);
    }
  }, [pending]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger({ openState: open, onOpen: openHandler, isSkinInWishlist, isChromaInWishlist })}
      </DialogTrigger>
      <DialogContent preventDefault showCloseButton className="gap-y-2">
        <DialogHeader className="px-2.5 pt-2">
          <DialogTitle>{t("skin.add")}</DialogTitle>
          <DialogDescription>
            {!!skinContentIds.length &&
              (skinContentIds.length === 1 && skinName ? (
                <>
                  {t("skin.addHelper")} <span className="font-medium">{skinName}</span>
                </>
              ) : (
                <>
                  {t("skin.addHelperMany")} ({skinContentIds.length})
                </>
              ))}
            {!!chromaContentIds.length &&
              (chromaContentIds.length === 1 && chromaName ? (
                <>
                  {t("chroma.addHelper")} <span className="font-medium">{chromaName}</span>
                </>
              ) : (
                <>
                  {t("chroma.addHelperMany")} ({chromaContentIds.length})
                </>
              ))}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-2 w-full overflow-hidden">
          <div role="list" className={cn({ "border-b pb-2": wishlists.length < 3 })}>
            {wishlists?.map((wishlist) => (
              <WishlistLine
                key={wishlist.id}
                wishlist={wishlist}
                skinContentIds={skinContentIds}
                chromaContentIds={chromaContentIds}
              />
            ))}
          </div>

          {wishlists.length < 3 && (
            <WishlistCreate skinContentIds={skinContentIds} chromaContentIds={chromaContentIds}>
              <Button variant="ghost" size="sm" className="justify-start">
                <PlusIcon />
                {t("wishlist.createAndAdd")}
              </Button>
            </WishlistCreate>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WishlistDialog;
