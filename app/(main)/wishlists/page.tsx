"use client";
import useUser from "@/api/useUser";
import useUserWishlists from "@/api/useUserWishlists";
import Skeleton from "@/components/Skeleton";
import { Typography } from "@/components/Typography";
import EmptyWishlists from "@/emptystates/EmptyWishlists";
import { cn } from "@/shared/cn";
// import EmailVerificationBanner from "@/widgets/EmailVerificationBanner";
import WishlistCard from "@/widgets/Wishlist/WishlistCard";
import WishlistCreate from "@/widgets/Wishlist/WishlistCreate";

const WishlistsPage = () => {
  const { data: wishlists = [], isLoading } = useUserWishlists(true);
  const { data: user } = useUser(true);

  if (!wishlists.length && !isLoading) {
    return <EmptyWishlists />;
  }

  return (
    <section>
      {/* {!!user && !user.is_verified && <EmailVerificationBanner className="mb-5" />} */}
      <div className="flex gap-4 justify-between mb-8">
        <div className='flex flex-col gap-y-2'>
          <Typography.H2>Мои Вишлисты</Typography.H2>
          <Typography.P className='text-muted-foreground'>Create, manage and track your dream collections.</Typography.P>
        </div>
        {((wishlists.length < 3 && !!wishlists.length) || user?.role === "admin") && <WishlistCreate size="lg" disabled={!user?.is_verified || isLoading} />}
      </div>
      <div
        className={cn("grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 auto-rows-fr", {
          "grid-cols-[repeat(auto-fit,minmax(320px,1fr))]!": wishlists.length > 2 || isLoading,
        })}
      >
        {isLoading && <Skeleton asChild count={3} className="h-64" />}
        {wishlists.map((wishlist) =>
          user?.is_verified ? (
            <WishlistCard key={wishlist.id} {...wishlist} />
          ) : (
            <div key={wishlist.id} className="pointer-events-none relative">
              <div className="absolute flex items-center justify-center size-full inset-0 bg-muted/50 z-10" />
              <WishlistCard {...wishlist} />
            </div>
          ),
        )}
      </div>
    </section>
  );
};

export default WishlistsPage;
