"use client";
import { format, formatDistanceToNow } from "date-fns";
import { CopyIcon, DotIcon, PencilIcon, Share2Icon, SquarePenIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useT } from "next-i18next/client";
import { FC, useCallback, useEffect } from "react";

import useWishlistSkins from "@/api/useWishlistSkins";
import { Typography } from "@/components/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmptyWishlistSkins from "@/emptystates/EmptyWishlistSkins";
import useWishlist from "@/hooks/useWishlist";
import { DATE_LOCALE } from "@/shared/constants/date_locales";
import { BREAKPOINTS } from "@/shared/constants/styles";
import { useAuth } from "@/shared/providers/AuthProvider";
import { formatNumber } from "@/shared/utils/formatNumber";
import { AppDataSkin } from "@/types/appdata";
import SkinCard from "@/widgets/Skin/SkinCard";
import VirtualizedGrid from "@/widgets/VirtualizedGrid";

const WishlistPage: FC = () => {
  const { t, i18n } = useT();
  const router = useRouter();

  const { userId } = useAuth();
  const { wishlistIdOrLink } = useParams<{ wishlistIdOrLink: string }>();
  const { data, isLoading, isGuest } = useWishlist(wishlistIdOrLink);

  const { data: skinsData, isLoading: isSkinsLoading } = useWishlistSkins(data?.id ?? "", i18n.language, !!data);

  useEffect(() => {
    if (data && data.user_id === userId && isGuest) {
      router.replace(`/wishlists/${data.id}`);
    }
  }, [data, userId, isGuest]);

  const renderSkin = useCallback((item: unknown, _index: number) => {
    const skin = item as AppDataSkin;
    return <SkinCard key={skin.id} data={skin} />;
  }, []);

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!data) {
    return <EmptyWishlistSkins />;
  }

  return (
    <>
      <section className="grid grid-cols-5 gap-4">
        <div className="flex flex-col col-span-3">
          <div className="flex items-center gap-x-2 mb-4">
            <Typography.H2>{data.name}</Typography.H2>
            <Button variant="ghost" size="icon-lg">
              <PencilIcon />
            </Button>
          </div>
          <Badge size="lg" variant={data.private ? "muted" : "primary-muted"} className="mb-auto">
            {t(`wishlist.private_${data.private}`)}
          </Badge>
          <Typography.Muted className="mt-3">Author: {data.user.name}</Typography.Muted>
          <div className="mt-1 flex items-center gap-x-1">
            <Typography.Muted>Created {format(new Date(data.created_at), "PPP", { locale: DATE_LOCALE[i18n.language] })}</Typography.Muted>
            <DotIcon className="text-muted-foreground" />
            <Typography.Muted>Updated {formatDistanceToNow(new Date(data.updated_at), { locale: DATE_LOCALE[i18n.language] })} ago</Typography.Muted>
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-y-4">
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
            <div className="px-5 py-4 bg-card rounded-md w-full overflow-hidden">
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

      <section className="grid grid-cols-5 gap-4 mt-5 mb-8">
        <div className="bg-card border rounded-md px-5 py-4">
          <Typography.Muted>TOTAL ITEMS</Typography.Muted>
          <Typography.Large className="text-4xl my-1 text-chart-2">{data.skins.length + data.chromas.length}</Typography.Large>
          <Typography.Muted className="flex items-center gap-x-0">
            <span>{data.skins.length} skins</span>
            <DotIcon />
            <span>{data.chromas.length} chromas</span>
          </Typography.Muted>
        </div>
        <div className="bg-card border rounded-md px-5 py-4">
          <Typography.Muted>TOTAL COST RP</Typography.Muted>
          <Typography.Large className="text-4xl my-1 text-chart-5">{formatNumber(data.price.total)}</Typography.Large>
          <Typography.Muted className="flex items-center gap-x-0">~ $1000 USD</Typography.Muted>
        </div>
        <div className="bg-card border rounded-md px-5 py-4">
          <Typography.Muted>COMPLETION</Typography.Muted>
          <Typography.Large className="text-4xl my-1 text-chart-4">
            {Math.round(((data.owned.skins + data.owned.chromas) / (data.skins.length + data.chromas.length)) * 100)}%
          </Typography.Large>
          <Typography.Muted className="flex items-center gap-x-0">
            {data.owned.skins + data.owned.chromas} / {data.skins.length + data.chromas.length} owned
          </Typography.Muted>
        </div>
        <div className="bg-card border rounded-md px-5 py-4">
          <Typography.Muted>WISHLIST VALUE</Typography.Muted>
          <Typography.Large className="text-4xl my-1 text-chart-3">{formatNumber(data.price.owned)}</Typography.Large>
          <Typography.Muted className="flex items-center gap-x-0">RP Owned</Typography.Muted>
        </div>
        <div className="bg-card border rounded-md px-5 py-4">
          <Typography.Muted>PRIORITY ITEMS</Typography.Muted>
          <Typography.Large className="text-4xl my-1 text-chart-1">{0}</Typography.Large>
          <Typography.Muted className="flex items-center gap-x-0">Marked as Priority</Typography.Muted>
        </div>
      </section>

      <Tabs defaultValue="skins" className='gap-y-4'>
        <TabsList variant="line" className="w-full px-5 justify-start gap-x-5">
          <TabsTrigger value="skins" className="grow-0 uppercase px-0 text-base">
            Skins
          </TabsTrigger>
          <TabsTrigger value="chromas" className="grow-0 uppercase px-0 text-base">
            Chromas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="skins">
          <VirtualizedGrid
            items={skinsData?.data ?? []}
            overscan={4}
            loading={isSkinsLoading}
            render={renderSkin}
            columnGap={16}
            rowGap={24}
            responsiveColumns={[
              { minWidth: BREAKPOINTS["4xl"], columns: 7 },
              { minWidth: BREAKPOINTS["3xl"], columns: 6 },
              { minWidth: BREAKPOINTS["2xl"], columns: 5 },
              { minWidth: BREAKPOINTS.xl, columns: 4 },
              { minWidth: BREAKPOINTS.lg, columns: 3 },
              { minWidth: BREAKPOINTS.md, columns: 2 },
              { minWidth: 0, columns: 2 },
            ]}
          />
        </TabsContent>
        <TabsContent value="chromas">chromas</TabsContent>
      </Tabs>
    </>
  );
};

export default WishlistPage;
