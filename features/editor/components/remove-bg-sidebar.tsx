import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

// import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

import { ActiveTool, Editor } from "@/features/editor/type";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { useRemoveBg } from "@/features/ai/api/use-remove-bg";

import { editorToolAsideClasses } from "@/features/editor/editor-tool-aside";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RemoveBgSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

/**
 * 清理由 Fabric/浏览器环境拼接出的尾部脏字符，避免图片地址包含 `)`、`:` 等非法结尾。
 */
const sanitizeImageUrl = (value?: string) => {
  return value?.trim().replace(/[):\]}>,.;]+$/g, "");
};

export const RemoveBgSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: RemoveBgSidebarProps) => {
  // const { shouldBlock, triggerPaywall } = usePaywall();
  const mutation = useRemoveBg();
  const t = useTranslations("Editor.RemoveBgSidebar");

  const selectedObject = editor?.selectedObjects[0];

  // @ts-ignore
  const rawImageSrc = selectedObject?._originalElement?.currentSrc as
    | string
    | undefined;
  const imageSrc = sanitizeImageUrl(rawImageSrc);

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onClick = () => {
    // if (shouldBlock) {
    //   triggerPaywall();
    //   return;
    // }

    mutation.mutate(
      {
        image: imageSrc as string,
      },
      {
        onSuccess: ({ data }: any) => {
          editor?.addImage(data);
        },
      },
    );
  };

  const isOpen = activeTool === "remove-bg";
  return (
    <aside className={editorToolAsideClasses(isOpen)}>
      <ToolSidebarHeader
        title={t("title")}
        description={t("description")}
      />
      {!imageSrc && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">
            {t("unsupportedObject")}
          </p>
        </div>
      )}
      {imageSrc && (
        <ScrollArea>
          <div className="p-4 space-y-4">
            <div
              className={cn(
                "relative aspect-square rounded-md overflow-hidden transition bg-muted",
                mutation.isPending && "opacity-50",
              )}
            >
              <Image src={imageSrc} fill alt={t("imageAlt")} className="object-cover" />
            </div>
            <Button
              disabled={mutation.isPending}
              onClick={onClick}
              className="w-full"
            >
              {t("submit")}
            </Button>
          </div>
        </ScrollArea>
      )}
      {isOpen && <ToolSidebarClose onClick={onClose} />}
    </aside>
  );
};
