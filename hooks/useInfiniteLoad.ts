import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersection } from "react-use";
import { RefObject, useEffect, useRef } from "react";
import { fetchClient } from "@/lib/fetchClient";

interface InfiniteLoad {
  url: string;
  queryKey: unknown[];
  params?: Record<string, string | undefined>;
  headers?: Record<string, string>;
  size?: number;
  skip?: boolean;
}

const useInfiniteLoad = <T extends Record<string, unknown>>({
  url,
  queryKey,
  params = {},
  headers = {},
  size = 30,
  skip,
}: InfiniteLoad) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const intersection = useIntersection(ref as RefObject<HTMLDivElement>, {
    root: null,
    rootMargin: "200px",
    threshold: 0,
  });

  const query = useInfiniteQuery({
    queryKey: [...queryKey, params, headers],
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

  useEffect(() => {
    if (intersection?.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [intersection?.isIntersecting]);

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
