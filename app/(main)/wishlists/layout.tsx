import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { verifyAccessToken } from '@/lib/auth';

const WishlistsLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const isAuth = !!verifyAccessToken(accessToken ?? "");

  if (isAuth) return children;

  return redirect("/auth/signin");
};

export default WishlistsLayout;
