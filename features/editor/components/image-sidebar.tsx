import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Loader } from "lucide-react";
import { useCallback } from "react";
import { useTranslations } from "next-intl";

import { ActiveTool, Editor } from "@/features/editor/type";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { useInfiniteImages } from "@/features/images/api/use-infinite-images";
import {
  IMAGES_PER_PAGE,
  LOAD_MORE_THRESHOLD,
  MAX_IMAGES,
} from "@/features/images/constants";
import { useLoadMoreOnScroll } from "@/features/images/hooks/use-load-more-on-scroll";

import { cn } from "@/lib/utils";
import { UploadButton } from "@/lib/uploadthing";

interface ImageSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ImageSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ImageSidebarProps) => {
  const t = useTranslations("Editor.ImageSidebar");

  const {
    images, // 当前已加载的所有图片数组
    isLoading, // 首次加载状态 (true/false)
    isError, // 是否出错
    hasNextPage, // 是否还有下一页数据
    isFetchingNextPage, // 是否正在加载下一页
    fetchNextPage, // 触发加载下一页的函数
    totalLoaded, // 已加载图片总数
    hasReachedMax, // 是否已达到最大加载限制
  } = useInfiniteImages();

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || hasReachedMax) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, hasReachedMax, isFetchingNextPage]);

  const { containerRef } = useLoadMoreOnScroll({
    hasMore: Boolean(hasNextPage) && !hasReachedMax,
    isLoadingMore: isFetchingNextPage,
    onLoadMore: handleLoadMore,
    threshold: LOAD_MORE_THRESHOLD,
  });

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "images" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title={t("title")}
        description={t("description", {
          total: totalLoaded,
          max: MAX_IMAGES,
        })}
      />
      <div className="p-4 border-b">
        <UploadButton
          appearance={{
            button: "w-full text-sm font-medium",
            allowedContent: "hidden",
          }}
          content={{
            button: t("upload"),
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            editor?.addImage(res[0].ufsUrl);
          }}
        />
      </div>
      {isLoading && (
        <div className="flex items-center justify-center flex-1">
          <Loader className="size-4 text-muted-foreground animate-spin" />
        </div>
      )}
      {isError && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">
            {t("fetchFailed")}
          </p>
        </div>
      )}

      {!isLoading && !isError && (
        <div ref={containerRef} className="min-h-0 flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {images.map((image) => {
                return (
                  <button
                    onClick={() => editor?.addImage(image.urls.regular)}
                    key={image.id}
                    className="relative w-full h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                  >
                    <Image
                      fill
                      src={image.urls.small}
                      alt={image.alt_description || "Image"}
                      sizes="(max-width: 768px) 50vw, 180px"
                      className="object-cover"
                    />
                    <Link
                      target="_blank"
                      href={image.links.html}
                      className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50 text-left"
                    >
                      {image.user.name}
                    </Link>
                  </button>
                );
              })}
            </div>

            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-2">
                <Loader className="size-4 text-muted-foreground animate-spin" />
              </div>
            )}

            {!isFetchingNextPage && hasNextPage && !hasReachedMax && (
              <p className="text-center text-xs text-muted-foreground">
                {t("loadingMore")}
              </p>
            )}

            {hasReachedMax && (
              <div className="rounded-md border border-dashed bg-muted/30 px-3 py-2 text-center text-xs text-muted-foreground">
                {t("maxReached", { max: MAX_IMAGES })}
              </div>
            )}

            {!hasReachedMax &&
              !hasNextPage &&
              images.length >= IMAGES_PER_PAGE && (
                <div className="rounded-md border border-dashed bg-muted/30 px-3 py-2 text-center text-xs text-muted-foreground">
                  {t("noMore")}
                </div>
              )}
          </div>
        </div>
      )}
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
