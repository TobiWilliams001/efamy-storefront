import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Stands in where the design calls for a photograph we have not been sent yet.
 * Deliberately plain: a pretty placeholder is easy to mistake for finished
 * work, and these need to look like something still owed.
 *
 * `label` names the shot so it doubles as a brief — whoever fills the gap can
 * read what belongs there off the page itself.
 */
export function ImagePlaceholder({
  label,
  className,
  tone = "light",
  /** Icon only, for tiles too small to carry the brief text. */
  compact = false,
}: {
  label: string;
  className?: string;
  tone?: "light" | "dark";
  compact?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-6 text-center",
        tone === "dark"
          ? "bg-white/5 text-white/50"
          : "bg-clay/30 text-gold-ink",
        className,
      )}
    >
      <ImageIcon
        aria-hidden="true"
        className={compact ? "size-5" : "size-6"}
        strokeWidth={1.5}
      />
      {compact ? null : (
        <span className="text-xs font-medium tracking-wide text-balance">
          {label}
        </span>
      )}
    </div>
  );
}
