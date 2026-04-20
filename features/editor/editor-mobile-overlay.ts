import type { ActiveTool } from "./type";

const EDITOR_MOBILE_OVERLAY_TOOLS = new Set<ActiveTool>([
  "shapes",
  "fill",
  "stroke-color",
  "stroke-width",
  "opacity",
  "text",
  "font",
  "images",
  "filter",
  "ai",
  "remove-bg",
  "draw",
]);

export function editorMobileOverlayOpen(activeTool: ActiveTool): boolean {
  return EDITOR_MOBILE_OVERLAY_TOOLS.has(activeTool);
}
