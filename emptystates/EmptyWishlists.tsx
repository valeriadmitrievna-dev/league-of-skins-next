"use client"
import { HeartOffIcon } from "lucide-react";
import { useT } from 'next-i18next/client';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import WishlistCreate from '@/widgets/Wishlist/WishlistCreate';

const EmptyWishlists = () => {
  const { t } = useT("emptystate");

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
        <WishlistCreate />
      </EmptyContent>
    </Empty>
  );
};

export default EmptyWishlists;