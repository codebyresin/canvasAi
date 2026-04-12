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
import { useTranslations } from "next-intl";
import { SidebarItem } from "./side-item";
import { ActiveTool } from "../type";

interface SidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Sidebar = ({ activeTool, onChangeActiveTool }: SidebarProps) => {
  const t = useTranslations("Editor.Sidebar");

  const sideItemOptions = [
    {
      icon: LayoutTemplate,
      label: t("design"),
      isActive: "templates",
    },
    {
      icon: ImageIcon,
      label: t("image"),
      isActive: "images",
    },
    {
      icon: Type,
      label: t("text"),
      isActive: "text",
    },
    {
      icon: Shapes,
      label: t("shapes"),
      isActive: "shapes",
    },
    {
      icon: Pencil,
      label: t("draw"),
      isActive: "draw",
    },
    {
      icon: Sparkles,
      label: t("ai"),
      isActive: "ai",
    },
    {
      icon: Settings,
      label: t("settings"),
      isActive: "settings",
    },
  ] as const;

  return (
    <aside className="bg-white flex flex-col w-25 h-full border-r overflow-y-auto">
      <ul className="flex flex-col">
        {sideItemOptions.map((item) => {
          return (
            <SidebarItem
              key={item.isActive}
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
