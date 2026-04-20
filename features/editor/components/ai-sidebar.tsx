import { useState } from "react";
import { useTranslations } from "next-intl";

// import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

import { ActiveTool, Editor } from "@/features/editor/type";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { useGenerateImage } from "@/features/ai/api/use-generate-image";

import { Button } from "@/components/ui/button";
import { editorToolAsideClasses } from "@/features/editor/editor-tool-aside";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AiSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const AiSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: AiSidebarProps) => {
  const t = useTranslations("Editor.AiSidebar");
  // const { shouldBlock, triggerPaywall } = usePaywall();
  const mutation = useGenerateImage();

  const [value, setValue] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (shouldBlock) {
    //   triggerPaywall();
    //   return;
    // }

    mutation.mutate(
      { prompt: value },
      {
        onSuccess: ({ data }: any) => {
          editor?.addImage(data);
        },
      },
    );
  };

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const isOpen = activeTool === "ai";
  return (
    <aside className={editorToolAsideClasses(isOpen)}>
      <ToolSidebarHeader title={t("title")} description={t("description")} />
      <ScrollArea className="min-h-0 flex-1">
        <form onSubmit={onSubmit} className="space-y-6 p-4">
          <Textarea
            disabled={mutation.isPending}
            placeholder={t("placeholder")}
            cols={30}
            rows={10}
            required
            minLength={3}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            disabled={mutation.isPending}
            type="submit"
            className="w-full"
          >
            {t("submit")}
          </Button>
        </form>
      </ScrollArea>
      {isOpen && <ToolSidebarClose onClick={onClose} />}
    </aside>
  );
};
