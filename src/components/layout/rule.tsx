import { cn } from "@/lib/utils";

/**
 * The gold ornament that sits under every section heading: a thin rule with a
 * diamond set into the middle. One component so the shape stays identical
 * across the site rather than being re-approximated per section.
 */
export function Rule({
  className,
  tone = "gold",
}: {
  className?: string;
  tone?: "gold" | "light";
}) {
  const colour = tone === "gold" ? "bg-gold" : "bg-white/70";

  return (
    <span
      aria-hidden="true"
      className={cn("flex items-center justify-center gap-1.5", className)}
    >
      <span className={cn("h-px w-7 rounded-full", colour)} />
      <span className={cn("size-1.5 rotate-45", colour)} />
      <span className={cn("h-px w-7 rounded-full", colour)} />
    </span>
  );
}
