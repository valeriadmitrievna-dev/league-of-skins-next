"use client";
import { format, formatDistanceToNow } from "date-fns";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useT } from "next-i18next/client";
import { FC, useCallback, useState } from "react";

import useWishlistSkins from "@/api/useWishlistSkins";
import BlendedGrid from "@/components/BlendedGrid";
import Search from '@/components/Search';
import { Typography } from "@/components/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmptyWishlistChromas from "@/emptystates/EmptyWishlistChromas";
import EmptyWishlistSkins from "@/emptystates/EmptyWishlistSkins";
import useWishlist from "@/hooks/useWishlist";
import { DATE_LOCALE } from "@/shared/constants/date_locales";
import { BREAKPOINTS } from "@/shared/constants/styles";
import { convertRP, getCurrencySymbol } from "@/shared/utils/convertRP";
import { formatNumber } from "@/shared/utils/formatNumber";
import { AppDataSkin } from "@/types/appdata";
import SkinCard from "@/widgets/Skin/SkinCard";
import VirtualizedGrid from "@/widgets/VirtualizedGrid";
import WishlistStatCard from "@/widgets/Wishlist/WishlistStatCard";

const WishlistPage: FC = () => {
  const { t, i18n } = useT();

  const { wishlistIdOrLink } = useParams<{ wishlistIdOrLink: string }>();
  const { data, isLoading, isGuest } = useWishlist(wishlistIdOrLink);

  const [tab, setTab] = useState<string>("skins");
  const { data: skinsData, isLoading: isSkinsLoading } = useWishlistSkins(data?.id ?? "", i18n.language, !!data);

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
      <section className="grid grid-cols-5 grid-rows-[1fr_auto_auto] gap-4 mt-4 mb-8">
        <BlendedGrid images={[...data.preview.skins, ...data.preview.chromas]} className="row-span-2" />
        <div className="flex flex-col gap-y-1 col-start-2 -col-end-1">
          <Badge variant={data.private ? "muted" : "primary-muted"}>{t(`wishlist.private_${data.private}`)}</Badge>
          <div className="flex items-center gap-x-2 mb-auto">
            <Typography.H2>{data.name}</Typography.H2>
            {/* <Button variant="ghost" size="icon-lg">
              <PencilIcon />
            </Button> */}
          </div>
          {isGuest && <Typography.Muted className="mt-3">Author: {data.user.name}</Typography.Muted>}
          <Typography.Muted>Created {format(new Date(data.created_at), "PPP", { locale: DATE_LOCALE[i18n.language] })}</Typography.Muted>
          <Typography.Muted>Updated {formatDistanceToNow(new Date(data.updated_at), { locale: DATE_LOCALE[i18n.language] })} ago</Typography.Muted>
          {/* <div className="mt-1 flex items-center gap-x-1">
            <DotIcon className="text-muted-foreground" />
          </div> */}
        </div>
        <div className="col-start-2 flex items-stretch gap-x-2">
          <Button variant="outline" className="grow">
            Share
          </Button>
          <Button variant="outline" size="icon-lg">
            <PencilIcon />
          </Button>
          <Button variant="outline" size="icon-lg">
            <TrashIcon />
          </Button>
        </div>
        <WishlistStatCard
          label="total items"
          value={String(data.skins.length + data.chromas.length)}
          sub={`${data.skins.length} skins\u00A0\u00A0•\u00A0\u00A0${data.chromas.length} chromas`}
          accent="chart-2"
          className="-grid-row-1 col-1"
        />
        <WishlistStatCard
          label="total cost rp"
          value={String(formatNumber(data.price.total))}
          sub={`~ ${formatNumber(convertRP(data.price.total, i18n.language))} ${getCurrencySymbol(i18n.language)}`}
          accent="chart-5"
          className="-grid-row-1"
        />
        <WishlistStatCard
          label="completion"
          value={`${Math.round(((data.owned.skins + data.owned.chromas) / (data.skins.length + data.chromas.length)) * 100)}%`}
          sub={`${data.owned.skins + data.owned.chromas} / ${data.skins.length + data.chromas.length} owned`}
          accent="chart-4"
          className="-grid-row-1"
        />
        <WishlistStatCard
          label="wishlist value"
          value={String(formatNumber(data.price.owned))}
          sub="RP Owned"
          accent="chart-3"
          className="-grid-row-1"
        />
        <WishlistStatCard
          label="priority items"
          value={String(data.skins.length + data.chromas.length)}
          sub="Marked as Priority"
          accent="chart-1"
          className="-grid-row-1"
        />
      </section>

      <Tabs value={tab} onValueChange={setTab} className="gap-y-4">
        <TabsList variant="line" className="w-full px-5 justify-start gap-x-5">
          <TabsTrigger value="skins" className="grow-0 uppercase px-0 text-base">
            Skins{" "}
            <Badge variant={tab === "skins" ? "accent" : "muted"} className="px-1.5">
              {data.skins.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="chromas" className="grow-0 uppercase px-0 text-base">
            Chromas{" "}
            <Badge variant={tab === "chromas" ? "accent" : "muted"} className="px-1.5">
              {data.chromas.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="skins">
          {!skinsData?.data.length && !isLoading && <EmptyWishlistSkins />}
          {!!skinsData?.data.length && (
            <div className="mb-4 flex items-center gap-x-4">
              <Search className='max-w-120_' />
            </div>
          )}
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
        <TabsContent value="chromas">
          <EmptyWishlistChromas />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default WishlistPage;
