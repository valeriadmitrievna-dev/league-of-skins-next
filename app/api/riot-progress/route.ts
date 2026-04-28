import { emitter } from "@/lib/progress-emitter"
import { riotProgress } from "@/lib/riotProgress"

export const runtime = "nodejs"

export const GET = () => {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      let closed = false

      const send = (data: any) => {
        if (closed) return
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        } catch {
          closed = true
        }
      }

      send(riotProgress)

      const handler = (data: any) => send(data)
      emitter.on("progress", handler)

      return () => {
        closed = true
        emitter.off("progress", handler)
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}