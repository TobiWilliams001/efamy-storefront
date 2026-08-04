import { CreditCard, Leaf, MapPin, Soup } from "lucide-react";

import { Container } from "@/components/layout/container";

const signals = [
  { icon: Soup, label: "Authentic Ghanaian recipes" },
  { icon: MapPin, label: "Proudly made in the UK" },
  { icon: Leaf, label: "Premium ingredients" },
  { icon: CreditCard, label: "Secure checkout" },
];

export function TrustBar() {
  return (
    <section
      aria-label="Why shop with us"
      className="border-b bg-muted/40 py-5"
    >
      <Container>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {signals.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center justify-center gap-2 text-center text-sm font-medium"
            >
              <Icon
                aria-hidden="true"
                className="size-4 shrink-0 text-gold-ink"
                strokeWidth={1.75}
              />
              {label}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
