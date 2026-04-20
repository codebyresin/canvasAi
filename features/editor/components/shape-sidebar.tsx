"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../type";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { editorToolAsideClasses } from "../editor-tool-aside";

const ShapeSidebarPanel = dynamic(() => import("./shape-sidebar-panel"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-40 flex-1 items-center justify-center p-4">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:120ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:240ms]" />
      </div>
    </div>
  ),
});

interface ShapeSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ShapeSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ShapeSidebarProps) => {
  const t = useTranslations("Editor.ShapeSidebar");
  const isOpen = activeTool === "shapes";

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        editorToolAsideClasses(isOpen),
        "max-md:overflow-hidden md:overflow-visible",
      )}
    >
      <div
        className={cn(
          "relative flex h-full w-full flex-col overflow-hidden border-r bg-white transition-transform duration-300 ease-out md:w-90",
          isOpen ? "translate-x-0" : "md:-translate-x-4",
        )}
      >
        <ToolSidebarHeader
          title={t("title")}
          description={t("description")}
        />
        {isOpen ? <ShapeSidebarPanel editor={editor} /> : null}
      </div>

      {isOpen && <ToolSidebarClose onClick={onClose} />}
    </aside>
  );
};
