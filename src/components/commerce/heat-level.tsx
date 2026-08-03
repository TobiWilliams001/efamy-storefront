import { Flame } from "lucide-react";

import { cn } from "@/lib/utils";
import type { HeatLevel as HeatLevelValue } from "@/types/product";

const HEAT_LABELS: Record<HeatLevelValue, string> = {
  1: "Mild",
  2: "Medium",
  3: "Hot",
  4: "Very hot",
  5: "Extra hot",
};

const MAX_HEAT = 5;

type HeatLevelProps = {
  level: HeatLevelValue;
  /** Show the written label alongside the flames. */
  showLabel?: boolean;
  className?: string;
};

/**
 * Heat is the main thing a chilli customer wants to know at a glance. The
 * flames are decorative — the accessible name carries the actual information,
 * so this never relies on colour or icon count alone.
 */
export function HeatLevel({
  level,
  showLabel = false,
  className,
}: HeatLevelProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      title={`${HEAT_LABELS[level]} — heat ${level} of ${MAX_HEAT}`}
    >
      <span aria-hidden="true" className="inline-flex items-center gap-0.5">
        {Array.from({ length: MAX_HEAT }, (_, index) => (
          <Flame
            key={index}
            className={cn(
              "size-3.5",
              index < level ? "fill-primary/15 text-primary" : "text-border",
            )}
          />
        ))}
      </span>
      {showLabel ? (
        <span className="text-sm text-muted-foreground">
          {HEAT_LABELS[level]}
        </span>
      ) : null}
      <span className="sr-only">
        Heat level: {HEAT_LABELS[level]}, {level} out of {MAX_HEAT}
      </span>
    </span>
  );
}
