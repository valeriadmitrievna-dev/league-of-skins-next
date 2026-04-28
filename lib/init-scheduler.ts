import { prepareRiot } from '@/riot/_prepare.riot';
import { createScheduler } from "./scheduler";

let started = false;

export const initScheduler = () => {
  if (started) return;
  started = true;

  console.log("🚀 Scheduler started");

  const start = createScheduler(async () => {
    await prepareRiot();
  }, { minutes: 30 });

  start();
};