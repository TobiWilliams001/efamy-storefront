import { cn } from "@/lib/utils";

/**
 * Label copy is written for a jar, which is too long for a card. These are the
 * short forms; the full wording stays on the product page.
 */
const SHORT_FORM: Record<string, string> = {
  "Suitable for vegans": "Vegan",
  "Suitable for vegetarians": "Vegetarian",
  "No artificial preservatives": "No preservatives",
};

export function DietaryBadges({
  dietary,
  allergens,
  className,
}: {
  dietary?: string[];
  allergens?: string[];
  className?: string;
}) {
  if (!dietary?.length && !allergens?.length) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {dietary?.map((claim) => (
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
