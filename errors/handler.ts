import { RequestError } from "./RequestError";

export const errorHandler = (err: unknown) => {
  console.error("⛔ API ERROR:", err);

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
