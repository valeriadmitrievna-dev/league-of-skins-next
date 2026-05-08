import { HeartOffIcon } from "lucide-react";
import { getT } from "next-i18next/server";

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import WishlistCreate from '@/widgets/Wishlist/WishlistCreate';

const EmptyWishlists = async () => {
  const { t } = await getT("emptystate");

  return (
    <Empty className='h-full grow min-h-0'>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HeartOffIcon />
        </EmptyMedia>
        <EmptyTitle>{t("noWishlists.title")}</EmptyTitle>
        <EmptyDescription>{t("noWishlists.description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <WishlistCreate>
          <Button>{t("wishlist.create")}</Button>
        </WishlistCreate>
      </EmptyContent>
    </Empty>
  );
};

export default EmptyWishlists;