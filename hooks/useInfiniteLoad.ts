import { useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { fetchClient } from "@/lib/fetchClient";

interface InfiniteLoad {
  url: string;
  queryKey: unknown[];
  params?: Record<string, string | undefined>;
  headers?: Record<string, string>;
  size?: number;
  skip?: boolean;
}

const useInfiniteLoad = <T extends Record<string, unknown>>({ url, queryKey, params = {}, headers = {}, size = 20, skip }: InfiniteLoad) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const fullQueryKey = [...queryKey, params, headers];
  const queryKeyString = JSON.stringify(fullQueryKey);

  const query = useInfiniteQuery({
    queryKey: fullQueryKey,
    queryFn: ({ pageParam }) =>
      fetchClient<{ count: number; data: T[] }>(url, {
        query: { ...params, page: pageParam as number, size },
        headers,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.length * size;
      return loaded < lastPage.count ? allPages.length + 1 : undefined;
    },
    placeholderData: (prev) => prev,
    enabled: !skip,
  });

  const { hasNextPage, fetchNextPage, isFetching } = query;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetching, fetchNextPage]);

  useEffect(() => {
    if (skip) {
      queryClient.resetQueries({ queryKey: fullQueryKey });
    }
  }, [skip, queryKeyString]);

  return {
    data: query.data?.pages.flatMap((p) => p.data) ?? [],
    count: query.data?.pages[0]?.count ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    initialized: query.isFetched,
    loaderRef: ref,
    hasMore: query.hasNextPage ?? false,
  };
};

export default useInfiniteLoad;
