"use client";

import { useSyncExternalStore } from "react";

/**
 * True once the page has scrolled past `threshold`.
 *
 * useSyncExternalStore rather than an effect: the scroll position is external
 * state that already exists before React mounts, so reading it in an effect
 * would render one frame with the wrong answer and trip the setState-in-effect
 * rule on the way.
 */
export function useScrolled(threshold = 24) {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("scroll", onChange, { passive: true });
      return () => window.removeEventListener("scroll", onChange);
    },
    () => window.scrollY > threshold,
    () => false,
  );
}
