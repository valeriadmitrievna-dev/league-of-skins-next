export interface Log {
  id: string;
  type: "default" | "warning" | "success" | "error";
  source: "client" | "server";
  message: string;
  time: Date;
}

type LogHandler = (log: Log) => void;

const handlers = new Set<LogHandler>();
const logs: Log[] = [];

const emit = (log: Log) => {
  logs.unshift(log);

  if (logs.length > 500) {
    logs.pop();
  }

  handlers.forEach((handler) => handler(log));
};

const createLogger =
  (type: Log["type"]) =>
  (...messages: unknown[]) => {
    const log: Log = {
      id: crypto.randomUUID(),
      type,
      source: typeof window === "undefined" ? "server" : "client",
      message: messages.map(String).join(" "),
      time: new Date(),
    };

    emit(log);
  };

export const logger = {
  subscribe(handler: LogHandler) {
    handlers.add(handler);
    return () => void handlers.delete(handler);
  },

  getLogs() {
    return logs;
  },

  clear() {
    logs.length = 0;
  },

  log: createLogger("default"),
  success: createLogger("success"),
  warning: createLogger("warning"),
  error: createLogger("error"),
};
