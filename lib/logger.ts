export interface Log {
  type: "default" | "warning" | "success" | "error";
  source?: "client" | "server";
  message: string;
  time: Date;
}

export type LogHandler = (log: Log) => void;
