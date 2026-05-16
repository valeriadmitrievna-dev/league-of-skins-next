import type { ComponentProps, FC } from "react";

import { cn } from "@/shared/cn";

interface AppHeaderLinkProps extends ComponentProps<"span"> {
  className?: string;
  disabled?: boolean;
}

const AppHeaderItem: FC<AppHeaderLinkProps> = ({ className, children }) => {
  return (
    <span role="button" className={cn("flex font-medium text-center text-muted-foreground py-2", className)}>
      {children}

      {/* <div className='hidden group-aria-[current=page]:block absolute -bottom-2 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-(--primary) to-transparent' /> */}
    </span>
  );
};

export default AppHeaderItem;
