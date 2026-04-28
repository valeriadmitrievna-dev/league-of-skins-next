import axios from "axios";
import { progressLog } from './riotProgress';

export const fetchRiot = async (url: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      progressLog.default(`[FETCH][${i + 1}] ${url}`);

      const res = await axios.get(url, {
        responseType: "text",
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
          "User-Agent": "Mozilla/5.0",
          Connection: "close",
          Accept: "application/json",
        },
        transitional: {
          clarifyTimeoutError: true,
        },
      });

      return JSON.parse(res.data);
    } catch (error: any) {
      progressLog.error(`[FETCH][${i + 1}][ERROR]`, error.code || error.message);

      const isRetryable = error.code === "ECONNRESET" || error.code === "ECONNABORTED" || error.message === "aborted";

      if (i === retries - 1 || !isRetryable) {
        throw error;
      }

      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
};
