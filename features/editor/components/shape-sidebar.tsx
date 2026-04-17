"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../type";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";

const ShapeSidebarPanel = dynamic(() => import("./shape-sidebar-panel"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-40 flex-1 items-center justify-center p-4 text-sm text-muted-foreground">
      ...
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
        "relative z-10 h-full transition-[width,opacity,transform] duration-300 ease-out overflow-visible",
        isOpen
          ? "visible w-90 translate-x-0 opacity-100"
          : "pointer-events-none invisible w-0 -translate-x-4 opacity-0",
      )}
    >
      <div
        className={cn(
          "relative flex h-full w-90 flex-col overflow-hidden border-r bg-white transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-4",
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
