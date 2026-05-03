type RequestOptions = RequestInit & {
  json?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
};

export const fetchClient = async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
  const { json, query, headers, signal, ...rest } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const queryString = query
    ? "?" +
      Object.entries(query)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&")
    : "";

  try {
    const res = await fetch(url + queryString, {
      ...rest,
      headers: {
        ...(json ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: json ? JSON.stringify(json) : undefined,
      signal: signal ?? controller.signal,
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) throw data;

    return data as T;
  } finally {
    clearTimeout(timeout);
  }
};
