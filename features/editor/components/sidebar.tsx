"use client";

import {
  LayoutTemplate,
  ImageIcon,
  Pencil,
  Settings,
  Shapes,
  Sparkles,
  Type,
} from "lucide-react";
import { SidebarItem } from "./side-item";
import { ActiveTool } from "../type";

interface SidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}
//侧边栏配置项
const SIDEITEMOPTION = [
  {
    icon: LayoutTemplate,
    label: "Design",
    isActive: "templates",
  },
  {
    icon: ImageIcon,
    label: "Image",
    isActive: "images",
  },
  {
    icon: Type,
    label: "Text",
    isActive: "text",
  },
  {
    icon: Shapes,
    label: "Shapes",
    isActive: "shapes",
  },
  {
    icon: Pencil,
    label: "Draw",
    isActive: "draw",
  },
  {
    icon: Sparkles,
    label: "AI",
    isActive: "ai",
  },
  {
    icon: Settings,
    label: "Settings",
    isActive: "settings",
  },
];
export const Sidebar = ({ activeTool, onChangeActiveTool }: SidebarProps) => {
  return (
    <aside className="bg-white flex flex-col w-25 h-full border-r overflow-y-auto">
      <ul className="flex flex-col">
        {SIDEITEMOPTION.map((item) => {
          return (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              isActive={activeTool === item.isActive}
              onClick={() => onChangeActiveTool(item.isActive as ActiveTool)}
            />
          );
        })}
      </ul>
    </aside>
  );
};
