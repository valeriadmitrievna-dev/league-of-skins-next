import { endpoint } from "@/lib/endpoint";
import { RequestError } from "@/errors";

export const GET = endpoint(async ({ user }) => {
  if (!user) throw new RequestError({ code: "ERR_0401", status: 401 });
  return user;
});
