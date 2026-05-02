import { endpoint } from "@/lib/endpoint";

export const POST = endpoint(async () => {
  return Response.json({ ok: true });
});
