import { getUserWishlists } from "@/api/server/getUserWishlists";
import { Typography } from "@/components/Typography";
import { getServerUserPayload } from '@/lib/auth';
import { cn } from "@/shared/cn";
import EmailVerificationBanner from "@/widgets/EmailVerificationBanner";
import WishlistCard from "@/widgets/Wishlist/WishlistCard";
import WishlistCreate from "@/widgets/Wishlist/WishlistCreate";

const WishlistsPage = async () => {
  const wishlists = await getUserWishlists();
  const user = await getServerUserPayload();

  return (
    <section>
      {!!user && !user.verified && <EmailVerificationBanner className="mb-5" />}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <Typography.H2>Мои Вишлисты</Typography.H2>
        {((wishlists.length < 3 && !!wishlists.length) || user?.role === "admin") && <WishlistCreate disabled={!user?.verified} />}
      </div>
      <div
        className={cn("mt-5 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-fr", {
          "grid-cols-[repeat(auto-fit,minmax(500px,1fr))]!": wishlists.length > 2,
        })}
      >
        {wishlists.map((wishlist) =>
          user?.verified ? (
            <WishlistCard key={wishlist.id} {...wishlist} userName={user?.userName} />
          ) : (
            <div key={wishlist.id} className="pointer-events-none relative">
              <div className="absolute flex items-center justify-center size-full inset-0 bg-muted/50 z-10" />
              <WishlistCard {...wishlist} userName={user?.userName} />
            </div>
          ),
        )}
      </div>
    </section>
  );
};

export default WishlistsPage;
