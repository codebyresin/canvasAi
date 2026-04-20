import { useTranslations } from "next-intl";
import { ActiveTool, Editor, STROKE_COLOR } from "@/features/editor/type";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { editorToolAsideClasses } from "@/features/editor/editor-tool-aside";
import { ColorPicker } from "./color-pick";

interface StrokeColorSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const StrokeColorSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: StrokeColorSidebarProps) => {
  const t = useTranslations("Editor.StrokeColorSidebar");
  const value = editor?.getActiveStrokeColor() || STROKE_COLOR;

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChange = (value: string) => {
    editor?.changeStrokeColor(value);
  };

  const isOpen = activeTool === "stroke-color";
  return (
    <aside className={editorToolAsideClasses(isOpen)}>
      <ToolSidebarHeader
        title={t("title")}
        description={t("description")}
      />
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-4 space-y-6">
          <ColorPicker value={value} onChange={onChange} />
        </div>
      </ScrollArea>
      {isOpen && <ToolSidebarClose onClick={onClose} />}
    </aside>
  );
};
