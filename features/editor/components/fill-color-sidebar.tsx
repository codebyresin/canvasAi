import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { ActiveTool, Editor, FILL_COLOR } from "../type";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { editorToolAsideClasses } from "../editor-tool-aside";

const ColorPicker = dynamic(() =>
  import("./color-pick").then((mod) => mod.ColorPicker),
);

interface FillColorSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}
export const FillColorSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FillColorSidebarProps) => {
  const t = useTranslations("Editor.FillColorSidebar");
  const value = editor?.getActiveFillColor() || FILL_COLOR;

  const onClose = () => {
    onChangeActiveTool("select");
  };
  const onChange = (value: string) => {
    editor?.changeFillColor(value);
  };
  const isOpen = activeTool === "fill";
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
