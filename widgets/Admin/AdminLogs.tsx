"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import useLogs from "@/hooks/useLogs";
import { cn } from "@/shared/cn";
import { format } from "date-fns";

const AdminLogs = () => {
  const logs = useLogs();

  return (
    <ScrollArea className="size-full py-2">
      {logs.map(({ message, time, type: logType, source }, i) => (
        <p
          key={`log-${i}`}
          className={cn("px-3 py-0.5 text-sm font-mono", {
            "text-muted-foreground": logType === "default",
            "text-yellow-600": logType === "warning",
            "text-destructive": logType === "error",
            "text-success": logType === "success",
          })}
        >
          [{source.toUpperCase()}] [{format(new Date(time), "HH:mm:ss")}] {message}
        </p>
      ))}
    </ScrollArea>
  );
};

export default AdminLogs;
