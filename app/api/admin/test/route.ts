import { logger } from "@/lib/logger";

export const GET = () => {
  logger.success("test от эндпоинта");
  return Response.json({ ok: true });
};