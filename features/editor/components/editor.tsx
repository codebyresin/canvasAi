"use client";

import dynamic from "next/dynamic";
import type { fabric } from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor } from "../hooks/useEditor";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";
import { Footer } from "./footer";
import { ActiveTool, selectionDependentTools } from "../type";

const FilterSidebar = dynamic(() =>
  import("./filter-sidebar").then((mod) => mod.FilterSidebar),
);
const OpacitySidebar = dynamic(() =>
  import("./opacity-sidebar").then((mod) => mod.OpacitySidebar),
);
const ShapeSidebar = dynamic(() =>
  import("./shape-sidebar").then((mod) => mod.ShapeSidebar),
);
const FillColorSidebar = dynamic(() =>
  import("./fill-color-sidebar").then((mod) => mod.FillColorSidebar),
);
const StrokeColorSidebar = dynamic(() =>
  import("./stroke-color-sidebar").then((mod) => mod.StrokeColorSidebar),
);
const StrokeWidthSidebar = dynamic(() =>
  import("./stroke-width.sidebar").then((mod) => mod.StrokeWidthSidebar),
);
const TextSidebar = dynamic(() =>
  import("./text-sidebar").then((mod) => mod.TextSidebar),
);
const FontSidebar = dynamic(() =>
  import("./font-sidebar").then((mod) => mod.FontSidebar),
);
const ImageSidebar = dynamic(() =>
  import("./image-sidebar").then((mod) => mod.ImageSidebar),
);
const AiSidebbar = dynamic(() =>
  import("./ai-sidebar").then((mod) => mod.AiSidebar),
);
const RemoveBgSidebar = dynamic(() =>
  import("./remove-bg-sidebar").then((mod) => mod.RemoveBgSidebar),
);

const Editor = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");

  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool("select");
    }
  }, [activeTool]);

  const { init, editor } = useEditor({
    clearSelectionCallback: onClearSelection,
  });
  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (activeTool === "draw") {
        editor?.disableDrawingMode();
      }
      if (tool === activeTool) {
        return setActiveTool("select");
      }
      if (tool === "draw") {
        editor?.enableDrawingMode();
      }
      setActiveTool(tool);
    },
    [activeTool, editor],
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initCanvas = async () => {
      const { fabric } = await import("fabric");

      if (
        cancelled ||
        fabricRef.current ||
        !canvasRef.current ||
        !containerRef.current
      ) {
        return;
      }

      const canvas = new fabric.Canvas(canvasRef.current, {
        controlsAboveOverlay: true,
        preserveObjectStacking: true, //!开启可以显示图层层级
      });

      fabricRef.current = canvas;

      init({
        initialCanvas: canvas,
        initialContainer: containerRef.current,
        initialFabric: fabric,
      });
    };

    void initCanvas();

    return () => {
      cancelled = true;
      fabricRef.current?.dispose();
      fabricRef.current = null;
    };
  }, [init]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <Navbar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ShapeSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FillColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeWidthSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <OpacitySidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <TextSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FontSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ImageSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FilterSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <AiSidebbar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <RemoveBgSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-muted">
          <Toolbar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            key={JSON.stringify(editor?.canvas.getActiveObject())}
          />
          <div
            className="relative min-h-0 flex-1 overflow-hidden bg-muted"
            ref={containerRef}
          >
            <canvas ref={canvasRef} />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Editor;
