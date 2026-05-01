import { logger } from "@/lib/logger";

export const GET = async () => {
  const stream = new ReadableStream({
    start(controller) {
      const unsubscribe = logger.subscribe((log) => {
        controller.enqueue(`data: ${JSON.stringify(log)}\n\n`);
      });

      return () => unsubscribe();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};