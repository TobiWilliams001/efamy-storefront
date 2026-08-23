"use client";

import { useEffect } from "react";

const OPEN = "details[data-filter-menu][open]";

/**
 * The parts of a menu that need script: dismissing it, and arrow keys.
 *
 * The menus are `details` elements so they open and navigate with none, which
 * is worth keeping. Everything here is an enhancement on top: if it never
 * loads, the menus still open, still navigate, and still close on a choice.
 */
export function DismissMenus() {
  useEffect(() => {
    const openMenus = () => document.querySelectorAll<HTMLDetailsElement>(OPEN);

    function close(menu: HTMLDetailsElement, focusSummary = false) {
      menu.open = false;
      if (focusSummary) menu.querySelector("summary")?.focus();
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // The scrim sits inside the details, so it needs naming explicitly.
      const onScrim = target.closest("[data-menu-scrim]");

      for (const menu of openMenus()) {
        if (onScrim || !menu.contains(target)) close(menu);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      const menu = (
        event.target as HTMLElement | null
      )?.closest<HTMLDetailsElement>(OPEN);

      if (event.key === "Escape") {
        for (const open of openMenus()) close(open, true);
        return;
      }

      if (!menu) return;

      const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
      if (!keys.includes(event.key)) return;

      const items = [...menu.querySelectorAll<HTMLAnchorElement>("a")];
      if (items.length === 0) return;

      event.preventDefault();
      const here = items.indexOf(document.activeElement as HTMLAnchorElement);

      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? items.length - 1
            : event.key === "ArrowDown"
              ? here < 0
                ? 0
                : (here + 1) % items.length
              : here <= 0
                ? items.length - 1
                : here - 1;

      items[next].focus();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
