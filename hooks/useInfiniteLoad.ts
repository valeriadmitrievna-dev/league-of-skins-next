import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useIntersection } from "react-use";

interface InfiniteLoad {
  url: string;
  params?: Record<string, string | undefined>;
  headers?: HeadersInit;
  size?: number;
  skip?: boolean;
}

const useInfiniteLoad = <T extends Record<string, unknown>>({
  url,
  params = {},
  headers = {},
  size = 30,
  skip,
}: InfiniteLoad) => {
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [count, setCount] = useState(0);
  const [data, setData] = useState<T[]>([]);

  const ref = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const paramsKey = JSON.stringify({ ...params, ...headers });

  const intersection = useIntersection(ref as RefObject<HTMLDivElement>, {
    root: null,
    rootMargin: "200px",
    threshold: 0,
  });

  const loadData = useCallback(
    async (currentPage: number) => {
      if (skip) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);

      try {
        const query = new URLSearchParams({
          ...params,
          page: String(currentPage),
          size: String(size),
        });

        const res = await fetch(`${url}?${query}`, {
          headers,
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const result = await res.json();

        setCount(result.count);
        setData((prev) => (currentPage === 1 ? result.data : [...prev, ...result.data]));
        setHasMore(currentPage * size < result.count);
        setPage(currentPage + 1);
      } catch (e: any) {
        if (e.name !== "AbortError") console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [url, paramsKey, size, skip],
  );

  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setCount(0);
    loadData(1);
  }, [paramsKey, url]);

  useEffect(() => {
    if (intersection?.isIntersecting && hasMore && !isLoading) {
      loadData(page);
    }
  }, [intersection?.isIntersecting]);

  return { data, isLoading, loaderRef: ref, hasMore, count };
};

export default useInfiniteLoad;
