"use client"
import { PlusIcon } from "lucide-react";
import { useT } from "next-i18next/client";
import { useState, type ChangeEvent, type FC, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/shared/cn";

interface WishlistCreateProps {
  buttonClassName?: string;
  skinContentIds?: string[];
  chromaContentIds?: string[];
  children?: ReactNode;
  disabled?: boolean;
}

const WishlistCreate: FC<WishlistCreateProps> = ({
  buttonClassName,
  // skinContentIds = [],
  // chromaContentIds = [],
  children,
  disabled,
}) => {
  const { t } = useT();

  const [wishlistName, setWishlistName] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const isWishlistCreating = false;

  const changeNameHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setWishlistName(event.target.value.slice(0, 100));
  };

  const createWishlistHandler = async () => {
    try {
      // await createWishlist(wishlistName?.trim(), skinContentIds, chromaContentIds);
    } catch (error) {
      console.error(error);
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button className={cn("", buttonClassName)} disabled={disabled}>
            <PlusIcon />
            {t("wishlist.create")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-full max-w-sm! overflow-hidden pt-4.5">
        <form className="flex flex-col justify-center">
          <DialogTitle>{t("wishlist.create_title")}</DialogTitle>
          <InputGroup className="mt-3">
            <InputGroupInput
              value={wishlistName}
              onChange={changeNameHandler}
              placeholder={t("wishlist.create_placeholder")}
            />
            <InputGroupAddon align="inline-end">{wishlistName.trim().length}/100</InputGroupAddon>
          </InputGroup>
          <Button
            type="submit"
            disabled={isWishlistCreating || !wishlistName?.trim()}
            className="mt-4"
            onClick={createWishlistHandler}
          >
            {isWishlistCreating && <Spinner />}

            {t("shared.save")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WishlistCreate;
