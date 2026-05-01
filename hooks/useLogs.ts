"use client";
import useClientLogs from "./useClientLogs";
import { useServerLogs } from "./useServerLogs";

const useLogs = () => {
  const clientLogs = useClientLogs();
  const serverLogs = useServerLogs();

  return [...clientLogs, ...serverLogs].sort((a, b) => +new Date(b.time) - +new Date(a.time))
};

export default useLogs;
