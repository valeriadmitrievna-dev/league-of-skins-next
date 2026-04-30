import { FC, PropsWithChildren } from "react";

const AuthFormWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <form className="h-screen flex flex-col items-center justify-center gap-y-4 p-6">
      {children}
    </form>
  );
};

export default AuthFormWrapper;
