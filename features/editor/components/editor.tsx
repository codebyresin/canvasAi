"use client";

import type { fabric } from "fabric";
import { useEffect, useRef } from "react";
import { useEditor } from "../hooks/useEditor";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";
import { Footer } from "./footer";

const Editor = () => {
  const { init } = useEditor();
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
        preserveObjectStacking: true,
      });

      fabricRef.current = canvas;

      init({
        initialCanvas: canvas,
        initialContainer: containerRef.current,
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
      <Navbar />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-muted">
          <Toolbar />
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
