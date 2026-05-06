import { fetch } from "undici";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) return Response.json({ error: "Missing url" }, { status: 400 });

  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "curl/8.7.1",
    },
  });

  console.log("[PROXY] status:", res.status);
  console.log("[PROXY] content-length:", res.headers.get("content-length"));

  const text = await res.text();
  console.log("[PROXY] length:", text.length);

  return new Response(text, { headers: { "Content-Type": "application/json" } });
};