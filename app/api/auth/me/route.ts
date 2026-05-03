import { RequestError } from "@/errors";
import { endpoint } from "@/lib/endpoint";

export const GET = endpoint(async ({ user }) => {
  if (!user) throw new RequestError({ code: "ERR_0401", status: 401 });
  const { password: _, ...safeUser } = user;
  return safeUser;
});
