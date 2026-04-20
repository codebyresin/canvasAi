"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(max-width: 767px)";

function subscribe(onStoreChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/** Matches Tailwind `md` breakpoint (768px): true when viewport is narrow / mobile-first sheet. */
export function useIsNarrowScreen() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
