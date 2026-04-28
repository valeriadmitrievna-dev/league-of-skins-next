import { addMilliseconds, differenceInMilliseconds } from "date-fns";

interface SchedulerOptions {
  days?: number;
  hours?: number;
  minutes?: number;
}

const getIntervalMs = ({ days = 0, hours = 0, minutes = 0 }: SchedulerOptions) => {
  return ((days * 24 + hours) * 60 + minutes) * 60 * 1000;
};

const getNextRunDelay = (lastRun: Date, intervalMs: number) => {
  const nextRun = addMilliseconds(lastRun, intervalMs);
  return Math.max(0, differenceInMilliseconds(nextRun, new Date()));
};

export const createScheduler = (fn: () => void | Promise<void>, options: SchedulerOptions) => {
  const intervalMs = getIntervalMs(options);

  const run = async () => {
    const start = new Date();
    await fn();
    const delay = getNextRunDelay(start, intervalMs);
    const hours = Math.round(delay / 1000 / 60 / 60);
    const days = Math.round(hours / 24);
    console.log(`⏳ Next run in ~${days > 0 ? days + "d" : hours + "h"}`);
    setTimeout(run, delay);
  };

  return () =>
    run().catch((error) => {
      console.log("[SCHEDULER FAILED]", (error as Error).message);
    });
};
