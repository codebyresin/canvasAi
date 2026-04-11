import type { fabric } from "fabric";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAutoResize } from "./useAutoResize";
import {
  BuildEditorProps,
  CIRCLE_OPTIONS,
  Editor,
  RECTANGLE_OPTIONS,
  DIAMOND_OPTIONS,
  TRIANGLE_OPTIONS,
  FILL_COLOR,
  STROKE_COLOR,
  STROKE_WIDTH,
  FabricNamespace,
} from "../type";
import { useCanvasEvents } from "./useCanvasEvents";
import { isTextType } from "../untils";

const WORKSPACE_NAME = "workspace";

/**
 * @返回一个对象
 * @这个对象可以插入图形到canvas并居中
 * @param param0
 * @returns
 */
const buildEditor = ({
  canvas,
  fabric,
  fillColor,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
}: BuildEditorProps): Editor => {
  const getWorkspace = () => {
    return canvas.getObjects().find((object) => object.name === WORKSPACE_NAME);
  };

  const center = (obj: fabric.Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();
    // @ts-expect-error fabric internal helper is not typed
    canvas._centerObject(obj, center);
  };

  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };

  return {
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas.renderAll();
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fill: value });
        }
        object.set({ stroke: value });
      });
      canvas.freeDrawingBrush.color = value;
      canvas.renderAll();
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });
      canvas.freeDrawingBrush.width = value;
      canvas.renderAll();
    },
    addCircle: () => {
      const obj = new fabric.Circle({
        ...CIRCLE_OPTIONS,
      });
      addToCanvas(obj);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 10,
        ry: 10,
      });
      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
      });
      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
      });

      addToCanvas(object);
    },
    addInverseTriangle: () => {
      const height = TRIANGLE_OPTIONS.height;
      const width = TRIANGLE_OPTIONS.width;
      const object = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: width, y: 0 },
          { x: width / 2, y: height },
        ],
        {
          ...TRIANGLE_OPTIONS,
        },
      );

      addToCanvas(object);
    },
    addDiamond: () => {
      const height = DIAMOND_OPTIONS.height;
      const width = DIAMOND_OPTIONS.width;

      const object = new fabric.Polygon(
        [
          { x: width / 2, y: 0 },
          { x: width, y: height / 2 },
          { x: width / 2, y: height },
          { x: 0, y: height / 2 },
        ],
        {
          ...DIAMOND_OPTIONS,
        },
      );
      addToCanvas(object);
    },
    canvas,
    fillColor,
  };
};

export const useEditor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [fabricApi, setFabricApi] = useState<FabricNamespace | null>(null);

  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);

  useCanvasEvents({ canvas, setSelectedObjects });
  useAutoResize({
    canvas,
    container,
  });

  useEffect(() => {
    const activeObject = selectedObjects[0];

    if (!activeObject) {
      setFillColor(FILL_COLOR);
      return;
    }

    const nextFill = activeObject.get("fill");
    if (typeof nextFill === "string") {
      setFillColor(nextFill);
    }
  }, [selectedObjects]);

  const editor = useMemo(() => {
    if (!canvas || !fabricApi) return undefined;

    return buildEditor({
      canvas,
      fabric: fabricApi,
      fillColor,
      strokeWidth,
      strokeColor,
      setFillColor,
      setStrokeColor,
      setStrokeWidth,
    });
  }, [canvas, fabricApi, fillColor, strokeColor, strokeWidth]);

  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
      initialFabric,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
      initialFabric: FabricNamespace;
    }) => {
      initialFabric.Object.prototype.set({
        cornerColor: "#FFF",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      });

      const workspace = new initialFabric.Rect({
        width: 3000,
        height: 2000,
        name: WORKSPACE_NAME,
        fill: "white",
        selectable: false,
        evented: false,
        hasControls: false,
        shadow: new initialFabric.Shadow({
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

      setCanvas(initialCanvas);
      setContainer(initialContainer);
      setFabricApi(initialFabric);
    },
    [],
  );

  return { init, editor };
};
