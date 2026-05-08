import { errorHandler } from "@/errors";
import { clearAuthCookies } from "@/lib/cookies";

export const POST = async () => {
  try {
    // Stateless auth — просто удаляем куки.
    // Если нужен server-side invalidate (blocklist) — добавляй здесь.
    await clearAuthCookies();
    return Response.json({ ok: true });
  } catch (error) {
    return errorHandler(error);
  }
};
