"use client";
import { useMutation } from "@tanstack/react-query";
import { FC, MouseEvent, ReactNode, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fetchClient } from "@/lib/fetchClient";
import { DbWishlist } from "@/types/db";

interface WishlistDeleteProps {
  id: string;
  trigger: ReactNode;
}

const WishlistDelete: FC<WishlistDeleteProps> = ({ id, trigger }) => {
  const [open, setOpen] = useState(false);

  const { mutate: deleteWishlist, isPending } = useMutation({
    mutationFn: () => fetchClient("/api/wishlists/" + id, { method: "DELETE" }),
    onMutate: (_, { client }) => {
      client.setQueryData(["userWishlists"], (prev: DbWishlist[]) => {
        return prev.filter((w) => w.id !== id);
      });
    },
    onSuccess: async (_data, _body, _, { client }) => {
      client.invalidateQueries({ queryKey: ["userWishlists"] });
      toast.success("Wishlist successfully deleted");
    },
    onError: (...error) => {
      console.log("[DEV]", error);
      toast.error("Error on deleting wishlist");
    },
  });

  const triggerClickHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setOpen(true);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger onClick={triggerClickHandler} asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete wishlist</AlertDialogTitle>
          <AlertDialogDescription>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero, similique!</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteWishlist()}>Submit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <Dialog open={isPending || open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={triggerClickHandler}>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent preventDefault>
        <DialogHeader>
          <DialogTitle>Delete wishlist</DialogTitle>
          <DialogDescription>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, laudantium?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button disabled={isPending}>Cancel</Button>
          <Button disabled={isPending} onClick={() => deleteWishlist()}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WishlistDelete;
