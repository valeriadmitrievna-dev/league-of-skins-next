import { errorHandler } from "@/errors";

type Context = {
  language: string;
  user: any;
};

export function endpoint<T>(fn: (req: Request, ctx: Context) => Promise<T>) {
  return async (req: Request): Promise<Response> => {
    try {
      const language = req.headers.get("Language") ?? "en_US";

      // сюда позже подключишь auth
      const user = null;

      const result = await fn(req, { language, user });

      return Response.json(result);
    } catch (err) {
      return errorHandler(err);
    }
  };
}
