"use client";
import { CiFileOn } from "react-icons/ci";
import {
  ChevronDown,
  Download,
  MousePointerClick,
  Redo2,
  Undo2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Hint } from "@/components/hint";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { BsCloudCheck } from "react-icons/bs";
import { ActiveTool } from "../type";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Navbar = ({ activeTool, onChangeActiveTool }: NavbarProps) => {
  const t = useTranslations("Editor.Navbar");

  return (
    <nav className="w-full flex items-center p-4 h-17 gap-x-8 border-b lg:pl-8.5">
      <Logo />
      <div className="w-full h-full flex items-center gap-x-1">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              {t("file")}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-60">
            <DropdownMenuItem
              onClick={() => {
                console.log("wait to do");
              }}
              className="flex items-center gap-x-2"
            >
              <CiFileOn className="size-8" />
              <div>
                <p>{t("open")}</p>
                <p className="text-xs text-muted-foreground">{t("openJson")}</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" className="mx-2" />
        <Hint label={t("select")} side="bottom" sideOffset={10}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onChangeActiveTool("select");
            }}
            className={cn(activeTool === "select" && "bg-gray-100")}
          >
            <MousePointerClick className="size-4" />
          </Button>
        </Hint>
        <Hint label={t("undo")} side="bottom" sideOffset={10}>
          <Button variant="ghost" size="icon" onClick={() => {}} className="">
            <Undo2 className="size-4" />
          </Button>
        </Hint>
        <Hint label={t("redo")} side="bottom" sideOffset={10}>
          <Button variant="ghost" size="icon" onClick={() => {}} className="">
            <Redo2 className="size-4" />
          </Button>
        </Hint>
        <Separator orientation="vertical" className="mx-2" />
        <div className="flex items-center gap-x-2">
          <BsCloudCheck className="size-4 text-muted-foreground" />
          <div className="text-xs text-muted-foreground">{t("saved")}</div>
        </div>
        <div className="flex items-center gap-x-4 ml-auto">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                {t("export")}
                <Download className="size-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-60">
              <DropdownMenuItem className="flex items-center gap-x-2" onClick={() => {}}>
                <CiFileOn className="size-8" />
                <div>
                  <p>{t("json")}</p>
                  <p className="text-xs text-muted-foreground">{t("saveForLaterEditing")}</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-x-2" onClick={() => {}}>
                <CiFileOn className="size-8" />
                <div>
                  <p>{t("png")}</p>
                  <p className="text-xs text-muted-foreground">{t("saveForLaterEditing")}</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-x-2" onClick={() => {}}>
                <CiFileOn className="size-8" />
                <div>
                  <p>{t("jpg")}</p>
                  <p className="text-xs text-muted-foreground">{t("saveForLaterEditing")}</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-x-2" onClick={() => {}}>
                <CiFileOn className="size-8" />
                <div>
                  <p>{t("svg")}</p>
                  <p className="text-xs text-muted-foreground">{t("saveForLaterEditing")}</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
