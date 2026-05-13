"use client";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useT } from "next-i18next/client";
import { useState, type ChangeEvent, type FC, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { fetchClient } from "@/lib/fetchClient";
import { cn } from "@/shared/cn";

interface WishlistCreateProps {
  buttonClassName?: string;
  skinContentIds?: string[];
  chromaContentIds?: string[];
  children?: ReactNode;
  disabled?: boolean;
}

const WishlistCreate: FC<WishlistCreateProps> = ({ buttonClassName, skinContentIds = [], chromaContentIds = [], children, disabled }) => {
  const { t } = useT();

  const [name, setName] = useState("");
  const [isPrivate, setPrivate] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  const { mutate: createWishlist, isPending: isWishlistCreating } = useMutation({
    mutationFn: (body: { name: string; private: boolean; skins?: string[]; chromas?: string[] }) =>
      fetchClient("/api/wishlists", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: async (_data, _body, _, { client: _client }) => {
      setModalOpen(false);
      toast.success("Wishlist successfully created");
    },
    onError: (...error) => {
      console.log("[DEV]", error);
      toast.error("Error on creating wishlist");
    },
  });

  const changeNameHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value.slice(0, 100));
  };

  const createWishlistHandler = async () => {
    try {
      await createWishlist({ name: name.trim(), private: isPrivate, skins: skinContentIds, chromas: chromaContentIds });
    } catch (error) {
      console.error(error);
    } finally {
      // setModalOpen(false);
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
        <DialogHeader>
          <DialogTitle>{t("wishlist.create_title")}</DialogTitle>
          <DialogDescription>{t("wishlist.create_description")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5 py-2">
          <Field>
            <Label>{t("wishlist.create_nameLabel")}</Label>
            <InputGroup>
              <InputGroupInput value={name} onChange={changeNameHandler} placeholder={t("wishlist.create_placeholder")} />
              <InputGroupAddon align="inline-end">{name.trim().length}/100</InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <Label>{t("wishlist.create_visibilityLabel")}</Label>
            <RadioGroup value={String(isPrivate)} onValueChange={(v) => setPrivate(v === "true")} className="flex flex-col gap-2">
              <Label
                htmlFor="visibility-public"
                className="flex items-center gap-3 rounded-lg border px-3 py-3 cursor-pointer transition-colors has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
              >
                <RadioGroupItem value="false" id="visibility-public" hidden />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium leading-none">{t("wishlist.create_visibilityPublicLabel")}</span>
                  <span className="text-xs text-muted-foreground">{t("wishlist.create_visibilityPublicDescription")}</span>
                </div>
              </Label>

              <Label
                htmlFor="visibility-private"
                className="flex items-center gap-3 rounded-lg border px-3 py-3 cursor-pointer transition-colors has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
              >
                <RadioGroupItem value="true" id="visibility-private" hidden />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium leading-none">{t("wishlist.create_visibilityPrivateLabel")}</span>
                  <span className="text-xs text-muted-foreground">{t("wishlist.create_visibilityPrivateDescription")}</span>
                </div>
              </Label>
            </RadioGroup>
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isWishlistCreating}>
            {t("wishlist.create_cancel")}
          </Button>
          <Button onClick={createWishlistHandler} disabled={!name?.trim() || isWishlistCreating}>
            {isWishlistCreating && <Spinner />}
            {t("wishlist.create_submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WishlistCreate;
