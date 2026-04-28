import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIntersection } from "react-use";

interface InfiniteLoad {
  url: string;
  params?: Record<string, string | undefined>;
  size?: number;
  skip?: boolean;
}

const useInfiniteLoad = <T extends Record<string, unknown>>({ url, params = {}, size = 20, skip }: InfiniteLoad) => {
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [count, setCount] = useState(1);
  const [data, setData] = useState<T[]>([]);

  const ref = useRef<HTMLDivElement | null>(null);

  const intersection = useIntersection(ref as RefObject<HTMLDivElement>, {
    root: null,
    rootMargin: "200px",
    threshold: 0,
  });

  const loadData = useCallback(async (overridePage?: number) => {
    if (isLoading || skip || data.length >= count) return;

    setLoading(true);
    const currentPage = overridePage ?? page;
    const query = new URLSearchParams({
      ...params,
      page: String(currentPage),
      size: String(size),
    });

    const res = await fetch(`${url}?${query}`);
    const result = await res.json();

    if (count !== result.count) setCount(result.count);
    setData((prev) => [...prev, ...result.data]);

    const nextHasMore = page * size < result.count;
    setHasMore(nextHasMore);

    if (nextHasMore) {
      setPage((p) => p + 1);
    }

    setLoading(false);
  }, [url, page, size, params, count, skip]);

  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
  }, [JSON.stringify(params)]);

  useEffect(() => {
    if (intersection?.isIntersecting) {
      loadData();
    }
  }, [intersection?.isIntersecting, loadData]);

  return {
    data,
    isLoading,
    loaderRef: ref,
    hasMore,
  };
};

export default useInfiniteLoad;
