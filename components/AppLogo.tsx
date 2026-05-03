import { type FC } from "react";

const AppLogo: FC = () => {
  return (
    <div className="flex items-center gap-3 md:gap-4 relative">
      <span className="text-lg leading-none md:text-3xl font-black uppercase tracking-wider text-primary">
        League of Skins
      </span>
      <div className="absolute -inset-1 bg-primary/20 blur-xl"></div>
    </div>
  );
};

export default AppLogo;
