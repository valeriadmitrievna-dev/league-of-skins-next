// lib/riotProgress.ts
import { emitter } from './progress-emitter';

export type LangStatus = "idle" | "loading" | "done" | "error" | "skipped";
export type CategoryStatus = "idle" | "loading" | "done" | "error";
export type LogType = "default" | "warning" | "success" | "error";

export interface LangProgress {
  status: LangStatus;
  categories: {
    versions: CategoryStatus;
    skinlines: CategoryStatus;
    champions: CategoryStatus;
    skins: CategoryStatus;
    chromas: CategoryStatus;
  };
  timeSeconds?: number;
  error?: string;
}

export interface RiotProgress {
  status: "idle" | "running" | "done" | "error";
  startedAt?: string;
  finishedAt?: string;
  languages: Record<string, LangProgress>;
  logs: { type: LogType; message: string }[];
}

const defaultLangProgress = (): LangProgress => ({
  status: "idle",
  categories: {
    versions: "idle",
    skinlines: "idle",
    champions: "idle",
    skins: "idle",
    chromas: "idle",
  },
});


const globalForProgress = globalThis as unknown as {
  riotProgress?: RiotProgress;
};

export const riotProgress =
  globalForProgress.riotProgress ?? {
    status: "idle",
    languages: {},
    logs: [],
  };

if (process.env.NODE_ENV !== "production") {
  globalForProgress.riotProgress = riotProgress;
}

const notify = () => {
  emitter.emit("progress", riotProgress);
};

const progressLogFn = (type: LogType) => (...message: string[]) => {
  riotProgress.logs.push({ type, message: `[${new Date().toLocaleTimeString()}] ${message.join(" ")}` });
  if (riotProgress.logs.length > 200) riotProgress.logs.shift();
  notify();
};

export const progressLog = {
  default: progressLogFn('default'),
  warning: progressLogFn('warning'),
  success: progressLogFn('success'),
  error: progressLogFn('error'),
};

export const setGlobalStatus = (status: RiotProgress["status"]) => {
  riotProgress.status = status;
  if (status === "running") riotProgress.startedAt = new Date().toISOString();
  if (status === "done" || status === "error") riotProgress.finishedAt = new Date().toISOString();
  notify();
};

export const initLang = (lang: string) => {
  riotProgress.languages[lang] = defaultLangProgress();
  notify();
};

export const setLangStatus = (lang: string, status: LangStatus, extra?: Partial<LangProgress>) => {
  if (!riotProgress.languages[lang]) riotProgress.languages[lang] = defaultLangProgress();
  Object.assign(riotProgress.languages[lang], { status, ...extra });
  notify();
};

export const setCategoryStatus = (lang: string, category: keyof LangProgress["categories"], status: CategoryStatus) => {
  if (!riotProgress.languages[lang]) riotProgress.languages[lang] = defaultLangProgress();
  riotProgress.languages[lang].categories[category] = status;
  notify();
};

export const resetProgress = () => {
  riotProgress.status = "idle"
  riotProgress.startedAt = undefined
  riotProgress.finishedAt = undefined
  riotProgress.languages = {}
  riotProgress.logs = []
  notify()
}
