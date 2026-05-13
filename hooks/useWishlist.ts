"use client";

import useGuestWishlist from "@/api/useGuestWishlist";
import useUserWishlist from "@/api/useUserWishlist";
import { isUUID } from "@/shared/utils/isUUID";

const useWishlist = (wishlistIdOrLink: string) => {
  const isGuest = !isUUID(wishlistIdOrLink);
  const owned = useUserWishlist(wishlistIdOrLink, !isGuest);
  const guest = useGuestWishlist(wishlistIdOrLink, isGuest);
  return { ...(isGuest ? guest : owned), isGuest };
};

export default useWishlist;
