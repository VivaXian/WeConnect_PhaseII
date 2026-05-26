import { useEffect, useState } from 'react';

export interface LoadMoreResult<T> {
  visibleItems: T[];
  hasMore: boolean;
  loadMore: () => void;
  total: number;
  shown: number;
}

export function useLoadMore<T>(items: T[], pageSize: number): LoadMoreResult<T> {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [items, pageSize]);

  const shown = Math.min(visibleCount, items.length);

  return {
    visibleItems: items.slice(0, visibleCount),
    hasMore: visibleCount < items.length,
    loadMore: () => setVisibleCount((c) => c + pageSize),
    total: items.length,
    shown,
  };
}
