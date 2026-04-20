import { useTranslations } from "next-intl";
import { ActiveTool, Editor, fonts } from "@/features/editor/type";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { ScrollArea } from "@/components/ui/scroll-area";
import { editorToolAsideClasses } from "@/features/editor/editor-tool-aside";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FontSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FontSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FontSidebarProps) => {
  const t = useTranslations("Editor.FontSidebar");
  const value = editor?.getActiveFontFamily();

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const isOpen = activeTool === "font";
  return (
    <aside className={editorToolAsideClasses(isOpen)}>
      <ToolSidebarHeader title={t("title")} description={t("description")} />
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-4 space-y-1 border-b">
          {fonts.map((font) => (
            <Button
              key={font}
              variant="secondary"
              size="lg"
              className={cn(
                "w-full h-16 justify-start text-left",
                value === font && "border-2 border-blue-500",
              )}
              style={{
                fontFamily: font,
                fontSize: "16px",
                padding: "8px 16px",
              }}
              onClick={() => editor?.changeFontFamily(font)}
            >
              {font}
            </Button>
          ))}
        </div>
      </ScrollArea>
      {isOpen && <ToolSidebarClose onClick={onClose} />}
    </aside>
  );
};
