import { ChevronsLeft } from "lucide-react";

import { cn } from "@/lib/utils";

interface ToolSidebarCloseProps {
  onClick: () => void;
}

export const ToolSidebarClose = ({ onClick }: ToolSidebarCloseProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "z-10 flex items-center justify-center border bg-white transition hover:cursor-pointer group",
        "max-md:absolute max-md:right-2 max-md:top-3 max-md:h-10 max-md:w-10 max-md:rounded-full max-md:shadow-md",
        "md:absolute md:top-1/2 md:h-[70px] md:-translate-y-1/2 md:rounded-r-xl md:border-y md:border-r md:px-1 md:pr-2 md:-right-[1.80rem]",
      )}
    >
      <ChevronsLeft className="size-4 text-foreground transition group-hover:opacity-75" />
    </button>
  );
};
