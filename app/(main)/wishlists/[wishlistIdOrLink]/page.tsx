"use client";
import { useParams, useRouter } from "next/navigation";
import { FC, useEffect } from "react";

import useWishlist from "@/hooks/useWishlist";
import { useAuth } from "@/shared/providers/AuthProvider";

const WishlistPage: FC = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const { wishlistIdOrLink } = useParams<{ wishlistIdOrLink: string }>();
  const { data: wishlist, isGuest } = useWishlist(wishlistIdOrLink);

  useEffect(() => {
    if (wishlist && wishlist.user_id === userId && isGuest) {
      router.replace(`/wishlists/${wishlist.id}`);
    }
  }, [wishlist, userId, isGuest]);

  return <>{wishlist?.name}</>;
};

export default WishlistPage;
