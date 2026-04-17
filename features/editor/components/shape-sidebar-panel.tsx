"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { Editor } from "../type";
import { ShapeTool } from "./shape-tool";
import {
  Circle,
  Diamond,
  Square,
  SquareRoundCorner,
  Triangle,
} from "lucide-react";

export default function ShapeSidebarPanel({
  editor,
}: {
  editor: Editor | undefined;
}) {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="grid grid-cols-3 gap-4 p-4">
        <ShapeTool onClick={() => editor?.addCircle()} icon={Circle} />
        <ShapeTool
          onClick={() => editor?.addSoftRectangle()}
          icon={SquareRoundCorner}
        />
        <ShapeTool onClick={() => editor?.addRectangle()} icon={Square} />
        <ShapeTool onClick={() => editor?.addTriangle()} icon={Triangle} />
        <ShapeTool
          onClick={() => editor?.addInverseTriangle()}
          icon={Triangle}
          iconClassName="rotate-180"
        />
        <ShapeTool onClick={() => editor?.addDiamond()} icon={Diamond} />
      </div>
    </ScrollArea>
  );
}
