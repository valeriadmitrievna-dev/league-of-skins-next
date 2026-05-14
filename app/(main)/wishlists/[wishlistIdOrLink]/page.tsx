"use client";
import { format, formatDistanceToNow } from "date-fns";
import { CopyIcon, DotIcon, PencilIcon, Share2Icon, SquarePenIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useT } from "next-i18next/client";
import { FC, useEffect } from "react";

import { Typography } from "@/components/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmptyWishlistSkins from "@/emptystates/EmptyWishlistSkins";
import useWishlist from "@/hooks/useWishlist";
import { DATE_LOCALE } from "@/shared/constants/date_locales";
import { useAuth } from "@/shared/providers/AuthProvider";

const WishlistPage: FC = () => {
  const { t, i18n } = useT();
  const router = useRouter();

  const { userId } = useAuth();
  const { wishlistIdOrLink } = useParams<{ wishlistIdOrLink: string }>();
  const { data, isLoading, isGuest } = useWishlist(wishlistIdOrLink);

  useEffect(() => {
    if (data && data.user_id === userId && isGuest) {
      router.replace(`/wishlists/${data.id}`);
    }
  }, [data, userId, isGuest]);

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!data) {
    return <EmptyWishlistSkins />;
  }

  return (
    <>
      <section className="flex items-stretch justify-between">
        <div className='flex flex-col'>
          <div className="flex items-center gap-x-2 mb-4">
            <Typography.H2>{data.name}</Typography.H2>
            <Button variant="ghost" size="icon-lg">
              <PencilIcon />
            </Button>
          </div>
          <Badge size="lg" variant={data.private ? "muted" : "primary-muted"} className='mb-auto'>
            {t(`wishlist.private_${data.private}`)}
          </Badge>
          <Typography.Muted className="mt-3">Author: {data.user_id.slice(0, 6)}</Typography.Muted>
          <div className="mt-1 flex items-center gap-x-1">
            <Typography.Muted>Created {format(new Date(data.created_at), "PPP", { locale: DATE_LOCALE[i18n.language] })}</Typography.Muted>
            <DotIcon className='text-muted-foreground' />
            <Typography.Muted>Updated {formatDistanceToNow(new Date(data.updated_at), { locale: DATE_LOCALE[i18n.language] })} ago</Typography.Muted>
          </div>
        </div>
        <div className="w-[40%] min-w-120 flex flex-col gap-y-4">
          <div className="flex items-stretch gap-4">
            <Button className="px-5 grow" variant="outline-primary" size="lg">
              <SquarePenIcon />
              Edit
            </Button>
            <Button className="px-5 grow" variant="outline" size="lg">
              <Share2Icon />
              Share
            </Button>
            <Button className="px-5 grow" variant="outline-destructive" size="lg">
              <TrashIcon />
              Delete
            </Button>
          </div>
          {!isGuest && (
            <div className="px-5 py-4 border bg-card rounded-md w-full overflow-hidden">
              <Typography.Muted>Wishlist link</Typography.Muted>
              <div className="flex items-end gap-2 mb-2">
                <Link href={data.link} target="_blank" className="text-primary text-sm truncate">
                  {window.location.host}/wishlists/{data.link}
                </Link>
                <Button size="xs" variant="outline">
                  <CopyIcon />
                  Copy
                </Button>
              </div>
              <Typography.Muted className="">Anyone with link can view this wishlist.</Typography.Muted>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default WishlistPage;
