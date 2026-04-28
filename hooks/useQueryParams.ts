import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useMemo } from "react";

export const useQueryParams = <T extends string>(keys: T[] = []) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const get = useCallback((key: T) => {
    const params = new URLSearchParams(searchParams);
    return params.get(key);
  }, [searchParams]);

  const update = useCallback((key: T, value?: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (params.get(key) === value) return;

    if (!value || value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const reset = useCallback(() => {
    router.replace(pathname);
  }, [router, pathname]);

  const hasActive = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    return keys.some((key) => !!params.get(key));
  }, [keys, searchParams]);

  return { get, update, reset, hasActive };
};
