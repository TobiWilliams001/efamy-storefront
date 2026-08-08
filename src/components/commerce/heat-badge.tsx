import { Flame } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Heat } from "@/types/product";

export const heatLabels: Record<Heat, string> = {
  mild: "Mild",
  hot: "Hot",
  "extra-hot": "Extra hot",
};

const flames: Record<Heat, number> = { mild: 1, hot: 2, "extra-hot": 3 };

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
        heat === "mild"
          ? "bg-secondary text-secondary-foreground"
          : "bg-brand/10 text-brand",
        className,
      )}
    >
      {Array.from({ length: flames[heat] }, (_, i) => (
        <Flame key={i} aria-hidden="true" className="size-3" />
      ))}
      {heatLabels[heat]}
    </span>
  );
}
