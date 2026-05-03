import { BookmarkIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, FC } from "react";
import { toast } from "sonner";

import Image from "@/components/Image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/shared/cn";
import { AppDataChroma } from '@/types/appdata';

interface ChromaCardProps extends ComponentProps<"div"> {
  className?: string;
  data: AppDataChroma;
  owned?: boolean | "hidden";
  addToWishlistButton?: boolean;
  toggleOwnedButton?: boolean;
  wishlistId?: string;
  plain?: boolean;
}

const ChromaCard: FC<ChromaCardProps> = ({
  className,
  data,
  owned,
  // addToWishlistButton,
  toggleOwnedButton,
  // wishlistId,
  plain,
  ...props
}) => {
  const toggleOwnedHandler = async () => {
    if (owned) {
      toast.success("Образ удален из купленных");
    } else {
      toast.success("Образ отмечен как купленный");
    }
  };

  // const removeFromWishlistHandler = async () => {
  //   try {
  //     if (wishlistId) {
  //       await updateWishlist({ wishlistId, body: { removeChromaIds: [data.contentId] } });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const ImageContent = (
    <Image
      src={data.path ?? ""}
      className={cn("object-cover size-full", {
        "transition-all group-hover:scale-[1.1]": !plain,
      })}
    />
  );

  return (
    <div
      className={cn(
        "h-full flex flex-col group rounded-md",
        {
          // "pointer-events-none": isOwningUpdating || isWishlistUpdating,
        },
        className,
      )}
      {...props}
    >
      <Card
        className={cn(
          "block relative group aspect-90/101 rounded-md overflow-hidden p-0",
          "transition-colors duration-700 group-data-state-on:bg-primary/10",
          "group-data-state-on:border-primary/50!",
        )}
      >
        {plain ? <div>{ImageContent}</div> : <Link href={`/skins/${data.skinContentId}`}>{ImageContent}</Link>}
        {data.pbe && <Badge className="absolute z-2 top-1.5 right-1.5">PBE</Badge>}
      </Card>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium line-clamp-1 mr-auto">{data.skinName}</span>
        {toggleOwnedButton &&
          (false ? (
            <Spinner className="size-5 my-1 mr-0.5 text-primary shrink-0" />
          ) : (
            <BookmarkIcon
              onClick={toggleOwnedHandler}
              className={cn("size-7 p-1 pr-0 cursor-pointer text-primary shrink-0", {
                "hover:fill-primary/50": !owned,
                "fill-primary": owned,
              })}
            />
          ))}
        {/* {addToWishlistButton && (
          <AddToWishlist
            chromaName={data.fullName}
            chromaContentIds={[data.contentId]}
            trigger={({ onOpen, isChromaInWishlist }) => (
              <HeartIcon
                onClick={onOpen}
                className={cn("size-7 p-1 pr-0 text-destructive cursor-pointer shrink-0", {
                  "fill-destructive": isChromaInWishlist,
                  "hover:fill-destructive/50": !isChromaInWishlist,
                })}
              />
            )}
          />
        )}
        {wishlistId &&
          (isWishlistUpdating ? (
            <Spinner className="size-5 my-1 text-primary shrink-0" />
          ) : (
            <HeartIcon
              onClick={removeFromWishlistHandler}
              className="size-7 p-1 pr-0 text-destructive cursor-pointer fill-destructive shrink-0"
            />
          ))} */}
      </div>
      {plain ? (
        <p className="mb-2 font-medium line-clamp-2">{data.name}</p>
      ) : (
        <Link href={`/skins/${data.skinContentId}`} className="mb-2 font-medium line-clamp-2 hover:underline w-fit">
          {data.name}
        </Link>
      )}
    </div>
  );
};

export default ChromaCard;
