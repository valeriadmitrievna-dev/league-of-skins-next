import { FC } from "react";

import { cn } from "@/shared/cn";

interface AuthFormTitleProps {
  children: string;
  className?: string;
}

const AuthFormTitle: FC<AuthFormTitleProps> = ({ children, className }) => {
  return <h1 className={cn("text-2xl font-semibold", className)}>{children}</h1>;
};

export default AuthFormTitle;
