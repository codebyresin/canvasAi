import  { fabric } from "fabric";
import { useCallback, useEffect, useRef } from "react";

interface UseAutoResizeProps {
  canvas: fabric.Canvas | null;
  container: HTMLDivElement | null;
}

const WORKSPACE_NAME = "workspace";

export const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
  const lastSizeRef = useRef({ width: 0, height: 0 });

  const autoZoom = useCallback(() => {
    if (!canvas || !container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    const workspace = canvas
      .getObjects()
      .find((object) => object.name === WORKSPACE_NAME);

    if (!workspace) return;

    canvas.setDimensions({ width, height });

    const zoomRatio = 0.85;
    // @ts-expect-error fabric util typing is incomplete
    const scale = fabric.util.findScaleToFit(workspace, { width, height });
    const zoom = scale * zoomRatio;
    const center = new fabric.Point(width / 2, height / 2);

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.zoomToPoint(center, zoom);

    const workspaceCenter = workspace.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;

    if (!viewportTransform) return;

    viewportTransform[4] = width / 2 - workspaceCenter.x * viewportTransform[0];
    viewportTransform[5] = height / 2 - workspaceCenter.y * viewportTransform[3];
    canvas.setViewportTransform(viewportTransform);

    workspace.clone((cloned: fabric.Rect) => {
      canvas.clipPath = cloned;
      canvas.requestRenderAll();
    });
  }, [canvas, container]);

  useEffect(() => {
    if (!canvas || !container) return;

    autoZoom();

    const resizeObserver = new ResizeObserver(() => {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;
      const { width, height } = lastSizeRef.current;

      if (nextWidth === width && nextHeight === height) {
        return;
      }

      lastSizeRef.current = { width: nextWidth, height: nextHeight };
      autoZoom();
    });

    lastSizeRef.current = {
      width: container.clientWidth,
      height: container.clientHeight,
    };

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [autoZoom, canvas, container]);
};
