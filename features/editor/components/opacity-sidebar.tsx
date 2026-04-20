import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { ActiveTool, Editor } from "@/features/editor/type";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { editorToolAsideClasses } from "@/features/editor/editor-tool-aside";

interface OpacitySidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const OpacitySidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: OpacitySidebarProps) => {
  const t = useTranslations("Editor.OpacitySidebar");
  const initialValue = editor?.getActiveOpacity() || 1;
  const selectedObject = useMemo(
    () => editor?.selectedObjects[0],
    [editor?.selectedObjects],
  );

  const [opacity, setOpacity] = useState(initialValue);

  useEffect(() => {
    if (selectedObject) {
      setOpacity(selectedObject.get("opacity") || 1);
    }
  }, [selectedObject]);

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChange = (value: number) => {
    editor?.changeOpacity(value);
    setOpacity(value);
  };

  const isOpen = activeTool === "opacity";
  return (
    <aside className={editorToolAsideClasses(isOpen)}>
      <ToolSidebarHeader
        title={t("title")}
        description={t("description")}
      />
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-4 space-y-4 border-b">
          <Slider
            value={[opacity]}
            onValueChange={(values) => onChange(values[0])}
            max={1}
            min={0}
            step={0.01}
          />
        </div>
      </ScrollArea>
      {isOpen && <ToolSidebarClose onClick={onClose} />}
    </aside>
  );
};
