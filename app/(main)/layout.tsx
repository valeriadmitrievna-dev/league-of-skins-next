import { AppHeader } from "@/widgets/AppHeader";
import { FC, PropsWithChildren } from "react";
import NextTopLoader from "nextjs-toploader";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      <AppHeader />
      <NextTopLoader color="var(--color-primary)" showSpinner={false} />
      <main className="h-full p-4 md:p-5 my-container">{children}</main>
    </div>
  );
};

export default MainLayout;
