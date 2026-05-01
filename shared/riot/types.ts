export type LangStatus = "idle" | "loading" | "done" | "error" | "skipped";
export type CategoryStatus = "idle" | "loading" | "done" | "error";
export type LogType = "default" | "warning" | "success" | "error";

export interface LangProgress {
  status: LangStatus;
  categories?: {
    versions?: CategoryStatus;
    skinlines?: CategoryStatus;
    champions?: CategoryStatus;
    skins?: CategoryStatus;
    chromas?: CategoryStatus;
  };
  counts?: {
    skinlines?: number;
    champions?: number;
    skins?: number;
    chromas?: number;
  };
  timeSeconds?: number;
  lastUpdate?: string;
  error?: string;
}

export interface RiotProgress {
  status: "idle" | "running" | "done" | "error";
  startedAt?: string;
  finishedAt?: string;
  languages: Record<string, LangProgress>;
  logs: { type: LogType; message: string }[];
}
