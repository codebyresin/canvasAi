import { cn } from "@/lib/utils";

/**
 * Tool panels: desktop = in-flow width transition; mobile = fixed sheet after icon rail.
 * When closed on narrow viewports, use `display:none` so many panels do not stack as fixed ghosts.
 */
export function editorToolAsideClasses(isOpen: boolean) {
  return cn(
    // Do not use bare `flex` here: it conflicts with `max-md:hidden` (both set display),
    // and whichever utility wins in the stylesheet can leave every "closed" panel visible in a row.
    "relative min-h-0 overscroll-contain border-r bg-white transition-[transform,opacity,visibility] duration-300 ease-out",
    "md:relative md:z-40 md:flex md:h-full md:flex-col md:overflow-visible",
    isOpen
      ? "md:visible md:w-90 md:translate-x-0 md:opacity-100"
      : "md:pointer-events-none md:invisible md:w-0 md:-translate-x-4 md:opacity-0",
    isOpen
      ? "max-md:fixed max-md:left-14 max-md:top-17 max-md:bottom-0 max-md:z-[45] max-md:flex max-md:flex-col max-md:w-[min(22.5rem,calc(100vw-3.5rem-0.75rem))] max-md:translate-x-0 max-md:opacity-100 max-md:shadow-2xl max-md:visible"
      : "max-md:hidden",
  );
}
