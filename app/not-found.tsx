import { FileSearchIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <FileSearchIcon className="size-12 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Страница не найдена</h1>
        <p className="text-muted-foreground max-w-md">
          Страница, которую вы ищете, не существует или была перемещена.
        </p>
      </div>
      <Button asChild>
        <Link href="/">На главную</Link>
      </Button>
    </div>
  );
};

export default NotFound;