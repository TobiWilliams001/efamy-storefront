"use client";

import { useEffect } from "react";

/**
 * Closes the filter disclosures on an outside click or Escape, the way a
 * native select behaves.
 *
 * The menus are `details` elements so they open and navigate with no
 * JavaScript, which is worth keeping. Dismissing them is the one part that
 * needs script, so it lives here on its own: if this never loads, the menus
 * still work and still close when an option is chosen.
 *
 * Marked with `data-filter-menu` rather than matched on tag, so an unrelated
 * `details` elsewhere on the page is left alone.
 */
export function DismissMenus() {
  useEffect(() => {
    const open = () =>
      document.querySelectorAll<HTMLDetailsElement>(
        "details[data-filter-menu][open]",
      );

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target) return;

      for (const menu of open()) {
        if (!menu.contains(target)) menu.open = false;
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      for (const menu of open()) {
        menu.open = false;
        // Focus goes back to the control that opened it, not to the page.
        menu.querySelector("summary")?.focus();
      }
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
