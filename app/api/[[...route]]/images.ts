import { Hono } from "hono";
import { unsplash } from "@/lib/unsplash";

import { IMAGES_PER_PAGE, MAX_IMAGES } from "@/features/images/constants";
import { ImagesPageResponse } from "@/features/images/types";

const DEFAULT_COLLECTION_IDS = ["317099"];

const app = new Hono().get("/", async (c) => {
  const pageParam = Number(c.req.query("page") ?? "1");
  const requestedPerPage = Number(
    c.req.query("perPage") ?? String(IMAGES_PER_PAGE),
  );

  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const perPage = Math.min(
    Math.max(
      Number.isFinite(requestedPerPage) ? requestedPerPage : IMAGES_PER_PAGE,
      1,
    ),
    IMAGES_PER_PAGE,
  );

  const maxPage = Math.ceil(MAX_IMAGES / perPage);

  if (page > maxPage) {
    return c.json<ImagesPageResponse>({
      data: [],
      page,
      perPage,
      nextPage: null,
      hasMore: false,
    });
  }

  const images = await unsplash.collections.getPhotos({
    collectionId: DEFAULT_COLLECTION_IDS[0],
    page,
    perPage,
  });

  if (images.errors) {
    return c.json({ error: "Something went wrong" }, 400);
  }

  const response = images.response;
  const hasMore = page < maxPage && response.results.length === perPage;

  return c.json<ImagesPageResponse>({
    data: response.results,
    page,
    perPage,
    nextPage: hasMore ? page + 1 : null,
    hasMore,
  });
});

export default app;
