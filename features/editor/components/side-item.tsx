import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}: SidebarItemProps) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "flex h-16 w-full min-h-12 flex-col items-center justify-center gap-0.5 rounded-none p-1 md:h-20 md:gap-1 md:py-4",
        isActive && "bg-muted text-primary",
      )}
      title={label}
    >
      <Icon className="size-[1.35rem] shrink-0 stroke-2 md:size-5" />
      <span className="max-w-full truncate px-0.5 text-[10px] leading-tight md:mt-1 md:text-xs">
        {label}
      </span>
    </Button>
  );
};
