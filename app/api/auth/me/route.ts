import { cookies } from "next/headers";

import { errorHandler, RequestError } from "@/errors";
import { verifyAccessToken } from "@/lib/auth";

export const GET = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) throw new RequestError({ code: "ERR_0001", status: 401 });

    const payload = verifyAccessToken(accessToken);
    if (!payload) throw new RequestError({ code: "ERR_0001", status: 401 });

    return Response.json(payload);
  } catch (error) {
    return errorHandler(error);
  }
};
