import { AppHeader } from "@/widgets/AppHeader";
import { FC, PropsWithChildren } from "react";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='min-h-screen grid grid-rows-[auto_1fr]'>
      <AppHeader />
      <main className='h-full p-4 md:p-5 my-container'>{children}</main>
    </div>
  );
};

export default MainLayout;
