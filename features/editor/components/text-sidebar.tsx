import { useTranslations } from "next-intl";
import { ActiveTool, Editor } from "@/features/editor/type";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { ScrollArea } from "@/components/ui/scroll-area";
import { editorToolAsideClasses } from "@/features/editor/editor-tool-aside";
import { Button } from "@/components/ui/button";

interface TextSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}
export const TextSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TextSidebarProps) => {
  const t = useTranslations("Editor.TextSidebar");
  const onClose = () => {
    onChangeActiveTool("select");
  };
  const isOpen = activeTool === "text";
  return (
    <aside className={editorToolAsideClasses(isOpen)}>
      <ToolSidebarHeader
        title={t("title")}
        description={t("description")}
      />
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-4 space-y-4 border-b">
          <Button
            className="w-full"
            onClick={() =>
              editor?.addText(t("defaultTextbox"), {
                fontSize: 60,
                fontWeight: 700,
              })
            }
          >
            {t("addTextbox")}
          </Button>
          <Button
            className="w-full h-16"
            variant="secondary"
            size="lg"
            onClick={() =>
              editor?.addText(t("defaultHeading"), {
                fontSize: 80,
                fontWeight: 700,
              })
            }
          >
            <span className="text-3xl font-bold">{t("addHeading")}</span>
          </Button>
          <Button
            className="w-full h-16"
            variant="secondary"
            size="lg"
            onClick={() =>
              editor?.addText(t("defaultSubheading"), {
                fontSize: 44,
                fontWeight: 600,
              })
            }
          >
            <span className="text-xl font-semibold">{t("addSubheading")}</span>
          </Button>
          <Button
            className="w-full h-16"
            variant="secondary"
            size="lg"
            onClick={() =>
              editor?.addText(t("defaultParagraph"), {
                fontSize: 32,
              })
            }
          >
            {t("paragraph")}
          </Button>
        </div>
      </ScrollArea>
      {isOpen && <ToolSidebarClose onClick={onClose} />}
    </aside>
  );
};
