"use client";

import { useEffect, useRef } from "react";

interface UseLoadMoreOnScrollProps {
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const useLoadMoreOnScroll = ({
  hasMore,
  isLoadingMore,
  onLoadMore,
  threshold = 50,
}: UseLoadMoreOnScrollProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const handleScroll = () => {
      const isScrollable = container.scrollHeight > container.clientHeight;

      if (!isScrollable) {
        return;
      }

      const distanceToBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;

      if (distanceToBottom <= threshold && hasMore && !isLoadingMore) {
        onLoadMore();
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, isLoadingMore, onLoadMore, threshold]);

  return { containerRef };
};
//
