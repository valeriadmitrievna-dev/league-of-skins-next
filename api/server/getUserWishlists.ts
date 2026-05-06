import { cookies, headers } from "next/headers";

import { DbWishlist } from "@/types/db";

export const getUserWishlists = async () => {
  try {
    const headersList = await headers();
    const cookieStore = await cookies();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const res = await fetch(`${protocol}://${host}/api/wishlists`, {
      headers: {
        cookie: cookieStore.toString(),
      },
      credentials: "include",
    });
    const wishlists: DbWishlist[] = await res.json();
    return wishlists;
  } catch (error) {
    return [];
  }
};
