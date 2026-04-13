import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../type";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShapeTool } from "./shape-tool";
import { IoTriangle } from "react-icons/io5";
import { FaDiamond } from "react-icons/fa6";
import { FaCircle, FaSquare, FaSquareFull } from "react-icons/fa";

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
        <ScrollArea className="min-h-0 flex-1">
          <div className="grid grid-cols-3 gap-4 p-4">
            <ShapeTool onClick={() => editor?.addCircle()} icon={FaCircle} />
            <ShapeTool
              onClick={() => editor?.addSoftRectangle()}
              icon={FaSquare}
            />
            <ShapeTool
              onClick={() => editor?.addRectangle()}
              icon={FaSquareFull}
            />
            <ShapeTool
              onClick={() => editor?.addTriangle()}
              icon={IoTriangle}
            />
            <ShapeTool
              onClick={() => editor?.addInverseTriangle()}
              icon={IoTriangle}
              iconClassName="rotate-180"
            />
            <ShapeTool onClick={() => editor?.addDiamond()} icon={FaDiamond} />
          </div>
        </ScrollArea>
      </div>

      {isOpen && <ToolSidebarClose onClick={onClose} />}
    </aside>
  );
};
