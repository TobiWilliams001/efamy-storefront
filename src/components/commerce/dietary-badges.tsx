import { cn } from "@/lib/utils";

/**
 * Label copy is written for a jar, which is too long for a card.
 */
const SHORT_FORM: Record<string, string> = {
  "Suitable for vegans": "Vegan",
  "Suitable for vegetarians": "Vegetarian",
  "No artificial preservatives": "No preservatives",
};

/**
 * Claims that tell one product apart from another. Brand-wide claims like
 * "no artificial preservatives" sit on five of twelve products and in the trust
 * bar, so repeating them on cards is noise rather than signal. The product page
 * still shows everything.
 */
const DIFFERENTIATING = new Set([
  "Suitable for vegans",
  "Suitable for vegetarians",
]);

export function DietaryBadges({
  dietary,
  allergens,
  /** Cards show only what differentiates; the product page shows everything. */
  variant = "full",
  className,
}: {
  dietary?: string[];
  allergens?: string[];
  variant?: "full" | "card";
  className?: string;
}) {
  const claims =
    variant === "card"
      ? dietary?.filter((claim) => DIFFERENTIATING.has(claim))
      : dietary;

  if (!claims?.length && !allergens?.length) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {claims?.map((claim) => (
        <li
          key={claim}
          className="rounded-full bg-sage/15 px-2 py-0.5 text-xs font-medium text-sage-ink"
        >
          {SHORT_FORM[claim] ?? claim}
        </li>
      ))}
      {allergens?.length ? (
        <li className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
          Contains {allergens.join(", ").toLowerCase()}
        </li>
      ) : null}
    </ul>
  );
}
