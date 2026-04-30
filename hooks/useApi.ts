import { ApiError } from "@/errors";
import { useState } from "react";

type RequestOptions = RequestInit & {
  json?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  contentType?: string;
};

export const api = async <T>(url: string, options: RequestOptions = {}) => {
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
      "Content-Type": options.contentType ?? "application/json",
      ...headers,
    },
    body: json ? JSON.stringify(json) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw data;
  }

  return data as T;
};

export const useApi = <T, B = any>(fn: (body: B) => Promise<T>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async (body: B) => {
    setData(null);
    setLoading(true);
    setError(null);

    try {
      const result = await fn(body);
      setData(result);
      return { data: result, error: null };
    } catch (e) {
      setError(e as ApiError);
      return { data: null, error: e };
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, data };
};
