import { Log, logger } from "@/lib/logger";

export const POST = async (req: Request) => {
  const { message, type = "default" } = await req.json();

  const validTypes = ["log", "success", "warning", "error"] as const;
  type ValidType = (typeof validTypes)[number];

  if (validTypes.includes(type)) {
    logger[type as ValidType](message);
  }

  return Response.json({ ok: true });
};
