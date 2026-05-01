import { Log } from "@/lib/logger";
import { cn } from "@/shared/cn";
import { format } from "date-fns";
import { FC } from "react";

interface LogLineProps extends Omit<Log, "source"> {
  source?: Log["source"];
  className?: string;
}

const LogLine: FC<LogLineProps> = ({ type, message, source, time, className }) => {
  return (
    <p
      className={cn(
        "px-1 py-0.5 text-sm font-mono",
        {
          "text-muted-foreground": type === "default",
          "text-yellow-600": type === "warning",
          "text-destructive": type === "error",
          "text-success": type === "success",
        },
        className,
      )}
    >
      {!!source && `[${source.toUpperCase()}] `}[{format(new Date(time), "HH:mm:ss")}] {message}
    </p>
  );
};

export default LogLine;
