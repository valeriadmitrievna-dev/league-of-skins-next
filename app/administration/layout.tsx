import { FC, PropsWithChildren } from "react";

import AdminLink from "@/widgets/Admin/AdminLink";

const AdministrationLayout: FC<PropsWithChildren> = async ({ children }) => {
  return (
    <div className="w-full h-[calc(100vh-65px-40px)] overflow-hidden grid grid-cols-[200px_1fr] gap-x-2">
      <div className="size-full flex flex-col p-2 gap-y-1 bg-muted rounded-md">
        <AdminLink href="/administration/test">Test</AdminLink>
        <AdminLink href="/administration/appdata">App Data</AdminLink>
      </div>
      {children}
    </div>
  );
};

export default AdministrationLayout;
