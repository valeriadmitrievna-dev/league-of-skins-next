import { logger } from "@/lib/logger";

export const GET = async () => {
  return Response.json(
    logger.getLogs().filter((l) => l.source === "server")
  );
};