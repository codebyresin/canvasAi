import { useTranslations } from "next-intl";
import {
  ActiveTool,
  Editor,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
} from "@/features/editor/type";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { editorToolAsideClasses } from "@/features/editor/editor-tool-aside";

interface StrokeWidthSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const StrokeWidthSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: StrokeWidthSidebarProps) => {
  const t = useTranslations("Editor.StrokeWidthSidebar");
  const widthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
  const typeValue = editor?.getActiveStrokeDashArray() || STROKE_DASH_ARRAY;

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChangeStrokeWidth = (value: number) => {
    editor?.changeStrokeWidth(value);
  };

  const onChangeStrokeType = (value: number[]) => {
    editor?.changeStrokeDashArray(value);
  };

  const isOpen = activeTool === "stroke-width";
  return (
    <aside className={editorToolAsideClasses(isOpen)}>
      <ToolSidebarHeader
        title={t("title")}
        description={t("description")}
      />
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">{t("widthLabel")}</Label>
          <Slider
            value={[widthValue]}
            onValueChange={(values) => onChangeStrokeWidth(values[0])}
          />
        </div>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">{t("typeLabel")}</Label>
          <Button
            onClick={() => onChangeStrokeType([])}
            variant="secondary"
            size="lg"
            className={cn(
              "w-full h-16 justify-start text-left",
              JSON.stringify(typeValue) === `[]` && "border-2 border-blue-500",
            )}
            style={{
              padding: "8px 16px",
            }}
          >
            <div className="w-full border-black rounded-full border-4" />
          </Button>
          <Button
            onClick={() => onChangeStrokeType([5, 5])}
            variant="secondary"
            size="lg"
            className={cn(
              "w-full h-16 justify-start text-left",
              JSON.stringify(typeValue) === `[5,5]` &&
                "border-2 border-blue-500",
            )}
            style={{
              padding: "8px 16px",
            }}
          >
            <div className="w-full border-black rounded-full border-4 border-dashed" />
          </Button>
        </div>
      </ScrollArea>
      {isOpen && <ToolSidebarClose onClick={onClose} />}
    </aside>
  );
};
