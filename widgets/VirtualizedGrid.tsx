"use client";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FC, type JSX, type ReactNode } from "react";
import { useWindowSize } from "react-use";

import Skeleton from "@/components/Skeleton";
import { cn } from "@/shared/cn";
import { BREAKPOINTS } from "@/shared/constants/styles";

interface VirtualizedGridProps {
  items: unknown[];
  render: (item: unknown, index: number) => ReactNode | JSX.Element;
  loading?: boolean;
  fetching?: boolean;
  emptyState?: ReactNode;

  overscan?: number;
  itemKey?: (item: unknown, index: number) => string | number;
  className?: string;
  gridClassName?: string;
  containerClassName?: string;
  estimatedItemHeight?: number;

  responsiveColumns?: Array<{
    minWidth: number;
    columns: number;
  }>;

  columnGap?: number;
  rowGap?: number;
}

const defaultBreakpoints = [
  { minWidth: BREAKPOINTS["2xl"], columns: 5 },
  { minWidth: BREAKPOINTS.xl, columns: 4 },
  { minWidth: BREAKPOINTS.lg, columns: 3 },
  { minWidth: BREAKPOINTS.md, columns: 2 },
  { minWidth: 0, columns: 2 },
];

const VirtualizedGrid: FC<VirtualizedGridProps> = ({
  items,
  render,
  loading,
  fetching,
  emptyState,

  overscan = 1,
  itemKey,
  className,
  gridClassName,
  containerClassName,
  estimatedItemHeight = 400,
  responsiveColumns = defaultBreakpoints,

  columnGap = 12,
  rowGap = 12,
}) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [_, setContainerWidth] = useState(0);

  const [isMounted, setIsMounted] = useState(false);
  const { width: windowWidth } = useWindowSize();

  useLayoutEffect(() => {
    if (!parentRef.current) return;

    const obs = new ResizeObserver(() => {
      setContainerWidth(parentRef.current?.clientWidth ?? 0);
    });

    obs.observe(parentRef.current);
    return () => obs.disconnect();
  }, [loading]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const columns = useMemo(() => {
    if (!isMounted) return defaultBreakpoints.at(-1)?.columns ?? 5;
    const sorted = [...responsiveColumns].sort((a, b) => b.minWidth - a.minWidth);
    const bp = sorted.find((b) => windowWidth >= b.minWidth);
    return bp?.columns ?? 4;
  }, [responsiveColumns, windowWidth, isMounted]);

  const rowCount = Math.ceil(items.length / columns);

  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => estimatedItemHeight + rowGap,
    overscan,
    measureElement: (el) => el.getBoundingClientRect().height + rowGap,
  });

  return (
    <div ref={parentRef} className={cn({ "hidden": !isMounted }, className)}>
      {loading && (
        <div
          className={cn("grid", gridClassName)}
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, rowGap, columnGap }}
        >
          <Skeleton count={20} asChild className="h-auto aspect-[1/1.2]" />
        </div>
      )}

      {!loading && !items.length && emptyState}

      {!loading && !!items.length && (
        <div
          className={containerClassName}
          style={{
            position: "relative",
            height: rowVirtualizer.getTotalSize(),
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className={cn("grid", gridClassName)}
              style={{
                position: "absolute",
                top: virtualRow.start,
                left: 0,
                width: "100%",
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                columnGap,
              }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => {
                const itemIndex = virtualRow.index * columns + colIndex;
                if (itemIndex >= items.length) return null;

                const item = items[itemIndex];
                const key = itemKey ? itemKey(item, itemIndex) : itemIndex;

                return (
                  <div key={key} className={cn({ "pointer-events-none animate-pulse": fetching })}>
                    {render(item, itemIndex)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VirtualizedGrid;
