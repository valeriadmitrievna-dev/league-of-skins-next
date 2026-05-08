import { toast } from "sonner";

import { RequestError } from "./RequestError";

export const errorHandler = (err: unknown) => {
  console.error(`⛔ API ERROR [${(err as RequestError).status}]:`, (err as Error).message);

  if (err instanceof RequestError) {
    return Response.json(err.toJSON(), {
      status: err.status,
    });
  }

  return Response.json(
    {
      code: "ERR_0000",
      message: (err as Error)?.message ?? "Internal error",
    },
    { status: 500 },
  );
};

export const errorClientHandler = (err: unknown) => {
  console.error(`⛔ API ERROR [${(err as RequestError).status}]:`, (err as Error).message);

  if (err instanceof RequestError) {
    toast.error(err.toJSON().message);
  }

  toast.error("Internal error");
};
