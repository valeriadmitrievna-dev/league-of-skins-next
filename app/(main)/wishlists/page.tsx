import { cookies } from "next/headers";

import { getUserWishlists } from "@/api/server/getUserWishlists";
import { Typography } from "@/components/Typography";
import { verifyAccessToken } from "@/lib/auth";
import WishlistCard from '@/widgets/Wishlist/WishlistCard';
import WishlistCreate from "@/widgets/Wishlist/WishlistCreate";

const WishlistsPage = async () => {
  const wishlists = await getUserWishlists();

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const payload = verifyAccessToken(accessToken ?? "");

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <Typography.H3>Мои Вишлисты</Typography.H3>
        {((wishlists.length < 3 && !!wishlists.length) || payload?.role === "admin") && <WishlistCreate />}
      </div>
      <div className="mt-5 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {wishlists.map(wishlist => <WishlistCard key={wishlist.id} {...wishlist} />)}
      </div>
    </section>
  );
};

export default WishlistsPage;
