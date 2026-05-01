"use client";
import { useEffect, useState } from "react";
import { logger, type Log } from "@/lib/logger";

const useClientLogs = () => {
  const [logs, setLogs] = useState<Log[]>(logger.getLogs());

  useEffect(() => {
    return logger.subscribe((log) => {
      setLogs((prev) => [log, ...prev]);
    });
  }, []);

  return logs;
};

export default useClientLogs;
