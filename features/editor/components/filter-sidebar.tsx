import { useTranslations } from "next-intl";
import { ActiveTool, Editor, filters } from "@/features/editor/type";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { ScrollArea } from "@/components/ui/scroll-area";
import { editorToolAsideClasses } from "@/features/editor/editor-tool-aside";
import { Button } from "@/components/ui/button";

interface FilterSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FilterSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FilterSidebarProps) => {
  const t = useTranslations("Editor.FilterSidebar");

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const isOpen = activeTool === "filter";
  return (
    <aside className={editorToolAsideClasses(isOpen)}>
      <ToolSidebarHeader
        title={t("title")}
        description={t("description")}
      />
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-4 space-y-1 border-b">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant="secondary"
              size="lg"
              className="w-full h-16 justify-start text-left"
              onClick={() => editor?.changeImageFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </ScrollArea>
      {isOpen && <ToolSidebarClose onClick={onClose} />}
    </aside>
  );
};
