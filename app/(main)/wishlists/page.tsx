import { getUser } from "@/api/server/getUser";
import { getUserWishlists } from "@/api/server/getUserWishlists";
import { Typography } from "@/components/Typography";
import EmailVerificationBanner from "@/widgets/EmailVerificationBanner";
import WishlistCard from "@/widgets/Wishlist/WishlistCard";
import WishlistCreate from "@/widgets/Wishlist/WishlistCreate";

const WishlistsPage = async () => {
  const wishlists = await getUserWishlists();
  const user = await getUser();

  return (
    <section>
      {!!user && !user.is_verified && <EmailVerificationBanner className="mb-5" />}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <Typography.H3>Мои Вишлисты</Typography.H3>
        {((wishlists.length < 3 && !!wishlists.length) || user?.role === "admin") && <WishlistCreate disabled={!user?.is_verified} />}
      </div>
      <div className="mt-5 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {wishlists.map((wishlist) =>
          user?.is_verified ? (
            <WishlistCard key={wishlist.id} {...wishlist} userName={user?.name} />
          ) : (
            <div key={wishlist.id} className="pointer-events-none relative">
              <div className="absolute flex items-center justify-center size-full inset-0 bg-muted/50 z-10" />
              <WishlistCard {...wishlist} userName={user?.name} />
            </div>
          ),
        )}
      </div>
    </section>
  );
};

export default WishlistsPage;
