import { useInfiniteQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

import { IMAGES_PER_PAGE, MAX_IMAGES } from "@/features/images/constants";
import { CanvaImage, ImagesPageResponse } from "@/features/images/types";

export const useInfiniteImages = () => {
  const query = useInfiniteQuery<ImagesPageResponse, Error, CanvaImage[]>({
    queryKey: ["images", IMAGES_PER_PAGE, MAX_IMAGES],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await client.api.images.$get({
        query: {
          page: String(pageParam),
          perPage: String(IMAGES_PER_PAGE),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      return response.json();
    },
    // 决定下一页参数，返回 undefined 则停止加载
    // lastPage: 上一页返回的数据
    // allPages: 所有已加载页面的数组
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce(
        (total, page) => total + page.data.length,
        0,
      );

      if (!lastPage.hasMore || totalLoaded >= MAX_IMAGES) {
        return undefined;
      }

      return lastPage.nextPage ?? undefined;
    },
    select: (data) =>
      data.pages.flatMap((page) => page.data).slice(0, MAX_IMAGES),
  });

  const totalLoaded = query.data?.length ?? 0;
  const hasReachedMax = totalLoaded >= MAX_IMAGES;

  return {
    ...query,
    images: query.data ?? [],
    totalLoaded,
    hasReachedMax,
  };
};
