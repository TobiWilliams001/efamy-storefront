import type { Metadata } from "next";

import { CartContents } from "@/components/cart/cart-contents";
import { Section, SectionHeader } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Basket",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <Section>
      <SectionHeader as="h1" title="Your basket" />
      <CartContents />
    </Section>
  );
}
