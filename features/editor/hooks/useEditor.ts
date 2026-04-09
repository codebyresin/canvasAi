import { fabric } from "fabric";
import { useCallback, useState } from "react";
import { useAutoResize } from "./useAutoResize";

const WORKSPACE_NAME = "workspace";

export const useEditor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useAutoResize({
    canvas,
    container,
  });

  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      fabric.Object.prototype.set({
        cornerColor: "#FFF",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      });

      const workspace = new fabric.Rect({
        width: 1200,
        height: 1200,
        name: WORKSPACE_NAME,
        fill: "white",
        selectable: false,
        evented: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: "rgba(0,0,0,0.12)",
          blur: 8,
        }),
      });

      initialCanvas.setDimensions({
        width: initialContainer.offsetWidth,
        height: initialContainer.offsetHeight,
      });
      initialCanvas.add(workspace);
      initialCanvas.centerObject(workspace);

      workspace.clone((cloned: fabric.Rect) => {
        initialCanvas.clipPath = cloned;
        initialCanvas.requestRenderAll();
      });

      const testRect = new fabric.Rect({
        width: 100,
        height: 100,
        fill: "black",
      });

      initialCanvas.add(testRect);
      initialCanvas.centerObject(testRect);
      initialCanvas.requestRenderAll();

      setCanvas(initialCanvas);
      setContainer(initialContainer);
    },
    [],
  );

  return { init };
};
