type RequestOptions = RequestInit & {
  json?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
};

export const fetchClient = async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
  const { json, query, headers, ...rest } = options;

  const queryString = query
    ? "?" +
      Object.entries(query)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&")
    : "";

  const res = await fetch(url + queryString, {
    ...rest,
    headers: {
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: json ? JSON.stringify(json) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) throw data;

  return data as T;
};
