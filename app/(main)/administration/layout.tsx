import AdminLink from "@/widgets/Admin/AdminLink";
import { headers } from "next/headers";
import Link from "next/link";
import { FC, PropsWithChildren } from "react";

const AdministrationLayout: FC<PropsWithChildren> = async ({ children }) => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname");

  return (
    <div className="w-full h-[calc(100vh-65px-40px)] overflow-hidden grid grid-cols-[200px_1fr] gap-x-2">
      <div className="size-full flex flex-col p-2 gap-y-1 bg-muted rounded-md">
        {pathname}
        <AdminLink href="/administration/logs">Logs</AdminLink>
        <AdminLink href="/administration/appdata">App Data</AdminLink>
      </div>
      {children}
    </div>
  );
};

export default AdministrationLayout;
