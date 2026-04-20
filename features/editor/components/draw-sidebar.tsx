import {
  ActiveTool,
  Editor,
  STROKE_COLOR,
  STROKE_WIDTH,
} from "@/features/editor/type";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ColorPicker } from "./color-pick";

import { cn } from "@/lib/utils";
import { editorToolAsideClasses } from "../editor-tool-aside";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DrawSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const DrawSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: DrawSidebarProps) => {
  const isOpen = activeTool === "draw";
  const colorValue = editor?.getActiveStrokeColor() || STROKE_COLOR;
  const widthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;

  const onClose = () => {
    editor?.disableDrawingMode();
    onChangeActiveTool("select");
  };

  const onColorChange = (value: string) => {
    editor?.changeStrokeColor(value);
  };

  const onWidthChange = (value: number) => {
    editor?.changeStrokeWidth(value);
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
          title="Drawing mode"
          description="Modify brush settings"
        />
        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-6 border-b p-4">
            <Label className="text-sm">Brush width</Label>
            <Slider
              value={[widthValue]}
              onValueChange={(values) => onWidthChange(values[0])}
            />
          </div>
          <div className="space-y-6 p-4">
            <ColorPicker value={colorValue} onChange={onColorChange} />
          </div>
        </ScrollArea>
      </div>

      {isOpen && <ToolSidebarClose onClick={onClose} />}
    </aside>
  );
};
