import Link from "next/link";
import { type FC } from "react";

import AppHeaderNav from "./AppHeaderNav";

const AppHeader: FC = async () => {
  return (
    <header className="relative border-b bg-card">
      <div className="h-14 md:h-15 flex items-center justify-between my-container">
        <Link href="/" className='group'>
          <div className="flex items-center gap-3 md:gap-4 relative">
            <span className="text-lg leading-none xl:text-2xl font-black uppercase tracking-wider text-primary">
              League of Skins
            </span>
            <div className="absolute -inset-1 bg-primary/10 blur-lg group-focus:bg-primary/30 group-focus:blur-xl transition-all"></div>
          </div>
        </Link>

        <AppHeaderNav className="hidden md:flex" />
      </div>
    </header>
  );
};

export default AppHeader;
