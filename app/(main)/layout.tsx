import NextTopLoader from "nextjs-toploader";

import AppNavigation from '@/widgets/AppNavigation/AppNavigation';

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppNavigation />
      {/* <AppHeader /> */}
      <NextTopLoader color="var(--color-primary)" showSpinner={false} />
      <main className="h-full min-h-screen p-5 pl-[calc(var(--navigation-size)+20px)]">{children}</main>
    </>
  );
};

export default MainLayout;
