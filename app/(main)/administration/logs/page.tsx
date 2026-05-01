"use client";

import LogLine from "@/components/LogLine";
import { ScrollArea } from "@/components/ui/scroll-area";
import useLogs from "@/hooks/useLogs";

const AdministrationLogs = () => {
  const logs = useLogs();

  return (
    <ScrollArea className="size-full bg-muted/50 overflow-hidden rounded-md p-2">
      {logs.map((log, i) => (
        <LogLine key={i} {...log} />
      ))}
    </ScrollArea>
  );
};

export default AdministrationLogs;
