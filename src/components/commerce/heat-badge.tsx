import { Flame } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Heat } from "@/types/product";

const labels: Record<Heat, string> = {
  mild: "Mild",
  hot: "Hot",
};

export function HeatBadge({
  heat,
  className,
}: {
  heat: Heat;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        heat === "hot"
          ? "bg-brand/10 text-brand"
          : "bg-secondary text-secondary-foreground",
        className,
      )}
    >
      <Flame aria-hidden="true" className="size-3" />
      {labels[heat]}
    </span>
  );
}
