import type { Metadata } from "next";

import { CartContents } from "@/components/cart/cart-contents";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Basket",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <PageHeader
        eyebrow="Basket"
        title="Your basket"
        description="Everything you have chosen so far. Delivery is calculated at checkout."
      />
      <Section spacing="afterHeader">
        <CartContents />
      </Section>
    </>
  );
}
