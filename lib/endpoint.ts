import { errorHandler } from "@/errors";
import { RequestError } from "@/errors";
import { getLanguageCode } from '@/shared/utils/getLanguageCode';
import { DbUser } from '@/types/db';

import { getServerUser } from "./auth";


export type EndpointContext = {
  language: string;
  user: DbUser | null;
  body: <T = unknown>() => Promise<T>;
  query: <T extends Record<string, string | undefined> = Record<string, string | undefined>>() => T;
};

export type ProtectedContext = EndpointContext & { user: DbUser };

const buildContext = async (req: Request): Promise<EndpointContext> => {
  const language = req.headers.get("Language") ?? "en_US";
  const user = await getServerUser();

  return {
    language: getLanguageCode(language),
    user,
    body: () => req.json(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: () => Object.fromEntries(new URL(req.url).searchParams.entries()) as any,
  };
};

export const endpoint = (fn: (ctx: EndpointContext) => Promise<unknown>) => {
  return async (req: Request): Promise<Response> => {
    try {
      const ctx = await buildContext(req);
      const result = await fn(ctx);
      return Response.json(result);
    } catch (err) {
      return errorHandler(err);
    }
  };
};

export const protectedEndpoint = (fn: (ctx: ProtectedContext) => Promise<unknown>) => {
  return endpoint(async (ctx) => {
    if (!ctx.user) {
      throw new RequestError({ code: "ERR_0401", status: 401, message: "Unauthorized" });
    }
    return fn(ctx as ProtectedContext);
  });
};