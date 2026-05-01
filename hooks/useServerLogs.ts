"use client";

import { useEffect, useState } from "react";
import type { Log } from "@/lib/logger";

export const useServerLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    fetch("/api/admin/logs")
      .then((res) => res.json())
      .then(setLogs);
  }, []);

  return logs;
};
